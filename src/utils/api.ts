import type { ParseResponse } from '../../shared/types'

const API_BASE = '/api'

export async function parseDouyinUrl(url: string): Promise<ParseResponse> {
  const response = await fetch(`${API_BASE}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '解析请求失败' }))
    return { success: false, error: errorData.error || '解析请求失败' }
  }

  return response.json()
}

export function getProxyDownloadUrl(originalUrl: string, filename: string): string {
  const encodedUrl = encodeURIComponent(originalUrl)
  const encodedFilename = encodeURIComponent(filename)
  return `${API_BASE}/proxy-download?url=${encodedUrl}&filename=${encodedFilename}`
}

export async function downloadFile(url: string, filename: string, onProgress?: (progress: number) => void): Promise<void> {
  const downloadUrl = getProxyDownloadUrl(url, filename)

  const response = await fetch(downloadUrl)

  if (!response.ok) {
    throw new Error('下载失败')
  }

  const contentLength = response.headers.get('content-length')
  const total = contentLength ? parseInt(contentLength, 10) : 0

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('无法读取响应流')
  }

  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    chunks.push(value)
    received += value.length

    if (total > 0 && onProgress) {
      onProgress(Math.round((received / total) * 100))
    }
  }

  const blob = new Blob(chunks)
  const blobUrl = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}