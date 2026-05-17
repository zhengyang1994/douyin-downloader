type DownloadCallbacks = {
  onProgress: (percent: number) => void
  onComplete: (filePath: string) => void
  onError: (error: string) => void
}

const callbacks = new Map<string, DownloadCallbacks>()

function getBridge(): any {
  if (typeof window === 'undefined') return null
  return (window as any).AndroidBridge || (window as any).DouyinNative || null
}

export function hasNativeBridge(): boolean {
  return getBridge() !== null
}

export function nativeDownloadToFile(
  url: string,
  filename: string,
  cb: DownloadCallbacks
): void {
  const bridge = getBridge()
  if (!bridge || !bridge.downloadToFile) {
    cb.onError('Native bridge not available')
    return
  }

  const callbackId = `dl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  callbacks.set(callbackId, cb)
  bridge.downloadToFile(url, filename, callbackId)
}

export function nativeOpenFile(filePath: string): void {
  const bridge = getBridge()
  if (bridge?.openFile) {
    bridge.openFile(filePath)
  }
}

export function nativeDeleteFile(filePath: string): boolean {
  const bridge = getBridge()
  if (bridge?.deleteDownloadedFile) {
    return bridge.deleteDownloadedFile(filePath)
  }
  return false
}

export function setupNativeCallbacks(): void {
  if (typeof window === 'undefined') return

  ;(window as any).__downloadProgress = (callbackId: string, percent: number) => {
    callbacks.get(callbackId)?.onProgress(percent)
  }

  ;(window as any).__downloadComplete = (callbackId: string, filePath: string) => {
    callbacks.get(callbackId)?.onComplete(filePath)
    callbacks.delete(callbackId)
  }

  ;(window as any).__downloadError = (callbackId: string, error: string) => {
    callbacks.get(callbackId)?.onError(error)
    callbacks.delete(callbackId)
  }
}
