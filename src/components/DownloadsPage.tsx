import { useState } from 'react'
import {
  Download,
  Film,
  Image,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  X,
  ChevronLeft,
  FolderOpen,
  Trash2,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { nativeOpenFile, nativeDeleteFile, hasNativeBridge } from '../utils/nativeBridge'

type SubTab = 'downloading' | 'completed'

export default function DownloadsPage() {
  const downloadItems = useAppStore((s) => s.downloadItems)
  const removeDownloadItem = useAppStore((s) => s.removeDownloadItem)
  const retryDownload = useAppStore((s) => s.retryDownload)
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const [subTab, setSubTab] = useState<SubTab>('downloading')

  const downloadingItems = downloadItems.filter(
    (i) => i.status === 'queued' || i.status === 'downloading'
  )
  const completedItems = downloadItems.filter(
    (i) => i.status === 'completed' || i.status === 'error'
  )

  const handleOpen = (filePath?: string) => {
    if (filePath) nativeOpenFile(filePath)
  }

  const handleDelete = (id: string, filePath?: string) => {
    if (filePath) nativeDeleteFile(filePath)
    removeDownloadItem(id)
  }

  return (
    <div className="min-h-screen min-h-dvh bg-brand-black pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        <h1 className="text-lg font-bold text-white">下载管理</h1>
      </div>

      {/* Sub-tabs */}
      <div className="flex mx-4 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
        <button
          onClick={() => setSubTab('downloading')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            subTab === 'downloading'
              ? 'bg-brand-cyan/20 text-brand-cyan shadow-sm'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          正在下载
          {downloadingItems.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-brand-pink text-white px-1.5 py-0.5 rounded-full">
              {downloadingItems.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('completed')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            subTab === 'completed'
              ? 'bg-brand-cyan/20 text-brand-cyan shadow-sm'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          已完成
          {completedItems.length > 0 && (
            <span className="ml-1.5 text-[10px] text-white/30">
              {completedItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-2">
        {subTab === 'downloading' && downloadingItems.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <Download className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">暂无下载任务</p>
          </div>
        )}

        {subTab === 'downloading' &&
          downloadingItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                  {item.type === 'video' ? (
                    <Film className="w-4 h-4 text-white/40" />
                  ) : (
                    <Image className="w-4 h-4 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 truncate">{item.filename}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {item.status === 'queued' ? (
                      <span className="text-[11px] text-white/40">排队中</span>
                    ) : (
                      <>
                        <Loader2 className="w-3 h-3 text-brand-cyan animate-spin shrink-0" />
                        <span className="text-[11px] text-brand-cyan">
                          下载中 {item.progress}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {item.status === 'queued' && (
                  <button
                    onClick={() => removeDownloadItem(item.id)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-white/40" />
                  </button>
                )}
              </div>
              {item.status === 'downloading' && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-cyan to-brand-pink rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <button
                    onClick={() => removeDownloadItem(item.id)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-white/40" />
                  </button>
                </div>
              )}
            </div>
          ))}

        {subTab === 'completed' && completedItems.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <CheckCircle2 className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">暂无下载记录</p>
          </div>
        )}

        {subTab === 'completed' &&
          completedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                  {item.type === 'video' ? (
                    <Film className="w-4 h-4 text-white/40" />
                  ) : (
                    <Image className="w-4 h-4 text-white/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/70 truncate">{item.filename}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {item.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-[11px] text-emerald-400">已完成</span>
                        {item.filePath && hasNativeBridge() && (
                          <span className="text-[9px] text-white/20 truncate ml-1 max-w-[120px]">
                            {item.filePath}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="text-[11px] text-red-400">
                          {item.errorMessage || '下载失败'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.status === 'completed' && hasNativeBridge() && (
                    <button
                      onClick={() => handleOpen(item.filePath)}
                      className="w-7 h-7 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 flex items-center justify-center transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-brand-cyan" />
                    </button>
                  )}
                  {item.status === 'error' && (
                    <button
                      onClick={() => retryDownload(item.id)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-white/50" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id, item.filePath)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/40" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
