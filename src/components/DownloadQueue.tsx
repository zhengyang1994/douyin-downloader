import { Download } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function DownloadQueue() {
  const downloadItems = useAppStore((s) => s.downloadItems)
  const setActiveTab = useAppStore((s) => s.setActiveTab)

  const activeCount = downloadItems.filter(
    (i) => i.status === 'queued' || i.status === 'downloading'
  ).length
  const completedCount = downloadItems.filter((i) => i.status === 'completed').length
  const totalCount = downloadItems.length

  if (totalCount === 0) return null

  return (
    <div className="px-5 mt-5 animate-slide-up">
      <button
        onClick={() => setActiveTab('downloads')}
        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.05] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-brand-cyan" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">下载列表</p>
            <p className="text-[11px] text-white/40 mt-0.5">
              {activeCount > 0 && `${activeCount} 个正在下载`}
              {activeCount > 0 && completedCount > 0 && ' · '}
              {completedCount > 0 && `${completedCount} 个已完成`}
              {activeCount === 0 && completedCount === 0 && `${totalCount} 个任务`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="bg-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
          <span className="text-white/20 text-xs">查看 &gt;</span>
        </div>
      </button>
    </div>
  )
}
