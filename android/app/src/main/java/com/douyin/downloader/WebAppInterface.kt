package com.douyin.downloader

import android.Manifest
import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.webkit.JavascriptInterface
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class WebAppInterface(private val context: Context, private val activity: MainActivity) {

    @JavascriptInterface
    fun showToast(message: String) {
        activity.runOnUiThread {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }
    }

    @JavascriptInterface
    fun downloadFile(url: String, fileName: String, mimeType: String) {
        activity.runOnUiThread {
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                if (ContextCompat.checkSelfPermission(
                        context, Manifest.permission.WRITE_EXTERNAL_STORAGE
                    ) != PackageManager.PERMISSION_GRANTED
                ) {
                    activity.requestStoragePermission()
                    showToast("请先授予存储权限")
                    return@runOnUiThread
                }
            }

            try {
                val request = DownloadManager.Request(Uri.parse(url))
                    .setTitle(fileName)
                    .setDescription("正在下载...")
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
                    .setAllowedOverMetered(true)
                    .setAllowedOverRoaming(true)

                if (!mimeType.isNullOrBlank()) {
                    request.setMimeType(mimeType)
                }

                val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                val downloadId = dm.enqueue(request)

                activity.registerDownloadReceiver(downloadId, fileName)
                showToast("开始下载: $fileName")
            } catch (e: Exception) {
                showToast("下载失败: ${e.message}")
            }
        }
    }

    @JavascriptInterface
    fun saveFile(base64Data: String, fileName: String, mimeType: String) {
        activity.runOnUiThread {
            try {
                val bytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT)
                val dir = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "DouyinDownloader")
                } else {
                    File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "DouyinDownloader")
                }

                if (!dir.exists()) dir.mkdirs()
                val file = File(dir, fileName)
                file.writeBytes(bytes)

                val intent = Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE)
                intent.data = Uri.fromFile(file)
                context.sendBroadcast(intent)

                showToast("已保存到: ${file.absolutePath}")
            } catch (e: Exception) {
                showToast("保存失败: ${e.message}")
            }
        }
    }

    @JavascriptInterface
    fun getClipboardText(): String {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
        val clip = clipboard.primaryClip
        if (clip != null && clip.itemCount > 0) {
            return clip.getItemAt(0).text?.toString() ?: ""
        }
        return ""
    }

    @JavascriptInterface
    fun fetchUrl(url: String, callbackId: String) {
        Thread {
            try {
                val conn = URL(url).openConnection() as HttpURLConnection
                conn.connectTimeout = 15000
                conn.readTimeout = 15000
                conn.instanceFollowRedirects = true
                conn.setRequestProperty(
                    "User-Agent",
                    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                )

                val code = conn.responseCode
                if (code in 200..399) {
                    val html = BufferedReader(InputStreamReader(conn.inputStream)).readText()
                    val escaped = html
                        .replace("\\", "\\\\")
                        .replace("'", "\\'")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r")
                    activity.runOnUiThread {
                        activity.evaluateJavascript("window.__nativeFetchCallback('$callbackId', '$escaped', null)")
                    }
                } else {
                    activity.runOnUiThread {
                        activity.evaluateJavascript("window.__nativeFetchCallback('$callbackId', null, 'HTTP $code')")
                    }
                }
            } catch (e: Exception) {
                val msg = (e.message ?: "Unknown error").replace("'", "\\'")
                activity.runOnUiThread {
                    activity.evaluateJavascript("window.__nativeFetchCallback('$callbackId', null, '$msg')")
                }
            }
        }.start()
    }
}