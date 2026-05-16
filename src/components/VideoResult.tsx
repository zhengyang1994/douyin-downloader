import { Download, Clock, User, Play } from 'lucide-react'
import type { VideoResource } from '../../shared/types'
import { useAppStore } from '../store/useAppStore'
import { downloadFile } from '../utils/api'
import { sanitizeFilename } from '../utils/helpers'
import ResolutionSelector from './ResolutionSelector'

interface VideoResultProps {
  data: VideoResource
}

export default function VideoResult({ data }: VideoResultProps) {
  const selectedResolution = useAppStore((s) => s.selectedResolution)
  const downloadProgress = useAppStore((s) => s.downloadProgress)
  const setDownloadProgress = useAppStore((s) => s.setDownloadProgress)
  const showToast = useAppStore((s) => s.showToast)
  const isLoading = useAppStore((s) => s.isLoading)

  const selectedRes = data.resolutions.find((r) => r.label === selectedResolution)

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDownload = async () => {
    if (!selectedRes) return

    try {
      setDownloadProgress(0)
      const filename = `${sanitizeFilename(data.title) || 'douyin_video'}_${selectedRes.label}.mp4`
      await downloadFile(selectedRes.url, filename, (progress) => {
        setDownloadProgress(progress)
      })
      showToast('下载完成！视频已保存到手机', 'success')
    } catch {
      showToast('下载失败，请重试', 'error')
    } finally {
      setDownloadProgress(0)
    }
  }

  return (
    <div className="px-5 mt-5 animate-slide-up">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="relative aspect-video bg-black/40 overflow-hidden">
          {data.cover ? (
            <img
              src={data.cover}
              alt={data.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-12 h-12 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md">
            <span className="text-xs text-white/80 font-medium">
              {formatDuration(data.duration)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{data.title}</h3>

          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {data.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(data.duration)}
            </span>
          </div>

          <ResolutionSelector resolutions={data.resolutions} />

          <button
            onClick={handleDownload}
            disabled={isLoading || !selectedResolution || downloadProgress > 0}
            className="ripple-effect w-full mt-4 py-3 rounded-xl font-bold text-sm tracking-wider
              bg-gradient-to-r from-brand-cyan to-brand-cyan-dark
              text-brand-black
              shadow-glow-cyan
              disabled:opacity-40 disabled:shadow-none
              hover:brightness-110
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {downloadProgress > 0 ? `下载中 ${downloadProgress}%` : '下载视频'}
          </button>

          {downloadProgress > 0 && (
            <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-cyan to-brand-pink rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}