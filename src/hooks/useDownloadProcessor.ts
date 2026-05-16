import { useEffect, useMemo, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { downloadFile } from '../utils/api'

export function useDownloadProcessor() {
  const processingRef = useRef(false)
  const downloadItems = useAppStore((s) => s.downloadItems)

  const queuedCount = useMemo(
    () => downloadItems.filter((i) => i.status === 'queued').length,
    [downloadItems]
  )

  useEffect(() => {
    if (queuedCount > 0 && !processingRef.current) {
      processNext()
    }
  }, [queuedCount])

  async function processNext(): Promise<void> {
    processingRef.current = true
    try {
      while (true) {
        const store = useAppStore.getState()
        const item = store.downloadItems.find((i) => i.status === 'queued')
        if (!item) break

        store.updateDownloadItem(item.id, { status: 'downloading' })

        try {
          await downloadFile(item.url, item.filename, (p) => {
            useAppStore.getState().updateDownloadItem(item.id, { progress: p })
          })
          useAppStore.getState().updateDownloadItem(item.id, {
            status: 'completed',
            progress: 100,
          })
          useAppStore.getState().showToast(`${item.filename} 下载完成`, 'success')
        } catch (err) {
          useAppStore.getState().updateDownloadItem(item.id, {
            status: 'error',
            errorMessage: err instanceof Error ? err.message : '下载失败',
          })
          useAppStore.getState().showToast(`${item.filename} 下载失败`, 'error')
        }
      }
    } finally {
      processingRef.current = false
      // Check if new items were added while processing, pick them up
      const store = useAppStore.getState()
      if (store.downloadItems.some((i) => i.status === 'queued')) {
        processNext()
      }
    }
  }
}
