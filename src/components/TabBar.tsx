import { Home, Download } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function TabBar() {
  const activeTab = useAppStore((s) => s.activeTab)
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const downloadItems = useAppStore((s) => s.downloadItems)

  const activeCount = downloadItems.filter(
    (i) => i.status === 'queued' || i.status === 'downloading'
  ).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-black/90 backdrop-blur-lg border-t border-white/[0.06]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-2.5 px-8 transition-colors duration-200 ${
            activeTab === 'home' ? 'text-brand-cyan' : 'text-white/30'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">首页</span>
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`relative flex flex-col items-center gap-0.5 py-2.5 px-8 transition-colors duration-200 ${
            activeTab === 'downloads' ? 'text-brand-cyan' : 'text-white/30'
          }`}
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-medium">下载</span>
          {activeCount > 0 && (
            <span className="absolute -top-0.5 right-[22px] bg-brand-pink text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full shadow-glow-pink">
              {activeCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
