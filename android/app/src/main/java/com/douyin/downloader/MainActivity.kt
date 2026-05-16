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
import android.os.Bundle
import android.os.Environment
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var downloadReceiver: BroadcastReceiver? = null
    private var pendingDownloadId: Long = -1
    private var pendingFileName: String = ""

    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            val allGranted = permissions.values.all { it }
            if (allGranted) {
                Toast.makeText(this, "权限已授予，请重试下载", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "需要存储权限才能下载文件", Toast.LENGTH_LONG).show()
            }
        }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
        }
        setContentView(webView)

        setupWebView()
        handleIntent(intent)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            }
            // Allow JavaScript from file:// URLs to make cross-origin requests
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                allowFileAccessFromFileURLs = true
                allowUniversalAccessFromFileURLs = true
            }
        }

        webView.addJavascriptInterface(
            WebAppInterface(this, this),
            "AndroidBridge"
        )

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false

                if (url.startsWith("blob:") || url.startsWith("data:")) {
                    return false
                }

                if (url.contains(".mp4") || url.contains(".webp") ||
                    url.contains(".jpg") || url.contains(".jpeg") ||
                    url.contains(".png") || url.contains(".gif")
                ) {
                    val fileName = url.substringAfterLast("/").substringBefore("?")
                    triggerDownload(url, fileName)
                    return true
                }

                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (url.contains("douyin.com") || url.contains("iesdouyin.com")) {
                        view?.loadUrl(url)
                        return true
                    }
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    return true
                }

                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                injectDownloadBridge()
            }
        }

        webView.webChromeClient = WebChromeClient()

        webView.loadUrl("file:///android_asset/www/index.html")
    }

    private fun injectDownloadBridge() {
        val js = """
            (function() {
                if (window.__douyinBridgeInjected) return;
                window.__douyinBridgeInjected = true;

                window.DouyinNative = {
                    downloadFile: function(url, fileName, mimeType) {
                        AndroidBridge.downloadFile(url, fileName, mimeType || '');
                    },
                    saveFile: function(base64, fileName, mimeType) {
                        AndroidBridge.saveFile(base64, fileName, mimeType || '');
                    },
                    showToast: function(msg) {
                        AndroidBridge.showToast(msg);
                    },
                    getClipboard: function() {
                        return AndroidBridge.getClipboardText();
                    }
                };
            })();
        """.trimIndent()
        webView.evaluateJavascript(js, null)
    }

    private fun triggerDownload(url: String, fileName: String) {
        try {
            val request = DownloadManager.Request(Uri.parse(url))
                .setTitle(fileName)
                .setDescription("抖音下载器 - 正在下载")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "DouyinDownloader/$fileName")
                .setAllowedOverMetered(true)
                .setAllowedOverRoaming(true)

            val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            val downloadId = dm.enqueue(request)
            registerDownloadReceiver(downloadId, fileName)

            Toast.makeText(this, "开始下载: $fileName", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "下载失败: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    fun registerDownloadReceiver(downloadId: Long, fileName: String) {
        unregisterDownloadReceiver()

        pendingDownloadId = downloadId
        pendingFileName = fileName

        downloadReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1) ?: -1
                if (id == pendingDownloadId) {
                    Toast.makeText(
                        this@MainActivity,
                        "下载完成: $pendingFileName\n文件保存在 下载/DouyinDownloader/",
                        Toast.LENGTH_LONG
                    ).show()
                    unregisterDownloadReceiver()
                }
            }
        }

        registerReceiver(
            downloadReceiver,
            IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE),
            Context.RECEIVER_NOT_EXPORTED
        )
    }

    fun evaluateJavascript(js: String) {
        webView.evaluateJavascript(js, null)
    }

    private fun unregisterDownloadReceiver() {
        downloadReceiver?.let {
            try { unregisterReceiver(it) } catch (_: Exception) {}
        }
        downloadReceiver = null
    }

    fun requestStoragePermission() {
        val permissions = if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
            arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        } else {
            arrayOf()
        }

        if (permissions.isNotEmpty()) {
            requestPermissionLauncher.launch(permissions)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleIntent(it) }
    }

    private fun handleIntent(intent: Intent) {
        val action = intent.action
        if (Intent.ACTION_VIEW == action || Intent.ACTION_SEND == action) {
            var url = intent.dataString

            if (url == null && intent.hasExtra(Intent.EXTRA_TEXT)) {
                url = intent.getStringExtra(Intent.EXTRA_TEXT)
            }

            if (url != null && (url.contains("douyin.com") || url.contains("iesdouyin.com"))) {
                val js = "document.getElementById('douyin-url-input')?.value = '${url.replace("'", "\\'")}';"
                webView.evaluateJavascript(js, null)
            }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        unregisterDownloadReceiver()
        webView.destroy()
        super.onDestroy()
    }
}