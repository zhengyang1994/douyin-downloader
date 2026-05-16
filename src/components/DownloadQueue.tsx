import { useState } from 'react'
import {
  Download,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  X,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function DownloadQueue() {
  const downloadItems = useAppStore((s) => s.downloadItems)
  const removeDownloadItem = useAppStore((s) => s.removeDownloadItem)
  const clearCompletedDownloads = useAppStore((s) => s.clearCompletedDownloads)
  const retryDownload = useAppStore((s) => s.retryDownload)
  const [expanded, setExpanded] = useState(true)

  if (downloadItems.length === 0) return null

  const activeCount = downloadItems.filter(
    (i) => i.status === 'queued' || i.status === 'downloading'
  ).length
  const completedCount = downloadItems.filter((i) => i.status === 'completed').length
  const errorCount = downloadItems.filter((i) => i.status === 'error').length

  return (
    <div className="px-5 mt-5 animate-slide-up">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-white/60" />
            <span className="text-sm font-bold text-white">下载列表</span>
            {activeCount > 0 && (
              <span className="bg-brand-pink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <span className="text-[11px] text-emerald-400/60">{completedCount} 已完成</span>
            )}
            {errorCount > 0 && (
              <span className="text-[11px] text-red-400/60">{errorCount} 失败</span>
            )}
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-white/30" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/30" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-2 max-h-80 overflow-y-auto">
            {downloadItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/70 truncate">{item.filename}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.status === 'queued' && (
                        <>
                          <Clock className="w-3 h-3 text-white/40" />
                          <span className="text-[11px] text-white/40">排队中</span>
                        </>
                      )}
                      {item.status === 'downloading' && (
                        <>
                          <Loader2 className="w-3 h-3 text-brand-cyan animate-spin" />
                          <span className="text-[11px] text-brand-cyan">下载中 {item.progress}%</span>
                        </>
                      )}
                      {item.status === 'completed' && (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400">已完成</span>
                        </>
                      )}
                      {item.status === 'error' && (
                        <>
                          <XCircle className="w-3 h-3 text-red-400" />
                          <span className="text-[11px] text-red-400">
                            {item.errorMessage || '下载失败'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {item.status === 'error' && (
                      <button
                        onClick={() => retryDownload(item.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-white/50" />
                      </button>
                    )}
                    {(item.status === 'completed' || item.status === 'error') && (
                      <button
                        onClick={() => removeDownloadItem(item.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-white/40" />
                      </button>
                    )}
                  </div>
                </div>

                {item.status === 'downloading' && (
                  <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-cyan to-brand-pink rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}

            {completedCount > 0 && (
              <button
                onClick={clearCompletedDownloads}
                className="w-full py-2 rounded-lg text-[11px] text-white/30 hover:text-white/60 border border-white/[0.06] hover:border-white/10 transition-colors"
              >
                清除已完成
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
