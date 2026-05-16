import { useState } from 'react'
import { Download, Image as ImageIcon, User, Check } from 'lucide-react'
import type { ImageResource } from '../../shared/types'
import { useAppStore } from '../store/useAppStore'
import { downloadFile } from '../utils/api'
import { sanitizeFilename } from '../utils/helpers'

interface ImageResultProps {
  data: ImageResource
}

export default function ImageResult({ data }: ImageResultProps) {
  const showToast = useAppStore((s) => s.showToast)
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())

  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleDownloadSingle = async (index: number) => {
    const img = data.images[index]
    if (!img) return

    try {
      setDownloadingIndex(index)
      const ext = img.url.includes('.webp') ? 'webp' : 'jpg'
      const filename = `${sanitizeFilename(data.title) || 'douyin_image'}_${index + 1}.${ext}`
      await downloadFile(img.url, filename)
      showToast('图片已保存到手机', 'success')
    } catch {
      showToast('下载失败，请重试', 'error')
    } finally {
      setDownloadingIndex(null)
    }
  }

  const handleDownloadSelected = async () => {
    if (selectedIndices.size === 0) return

    try {
      setDownloadingAll(true)
      let successCount = 0

      for (const index of selectedIndices) {
        const img = data.images[index]
        if (!img) continue

        try {
          const ext = img.url.includes('.webp') ? 'webp' : 'jpg'
          const filename = `${sanitizeFilename(data.title) || 'douyin_image'}_${index + 1}.${ext}`
          await downloadFile(img.url, filename)
          successCount++
        } catch {
          // 单张失败继续下载
        }
      }

      showToast(`已保存 ${successCount}/${selectedIndices.size} 张图片`, 'success')
    } catch {
      showToast('批量下载失败', 'error')
    } finally {
      setDownloadingAll(false)
    }
  }

  return (
    <div className="px-5 mt-5 animate-slide-up">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-4">
          <h3 className="text-base font-bold text-white mb-1">{data.title}</h3>
          <div className="flex items-center gap-1 text-xs text-white/40 mb-4">
            <User className="w-3 h-3" />
            {data.author}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.images.map((img, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => toggleSelect(index)}
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={img.thumb}
                    alt={`${data.title} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const placeholder = document.createElement('div')
                        placeholder.className = 'w-full h-full flex items-center justify-center'
                        placeholder.innerHTML = '<svg class="w-8 h-8 text-white/20" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
                        parent.appendChild(placeholder)
                      }
                    }}
                  />
                </div>

                {selectedIndices.has(index) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-pink flex items-center justify-center shadow-glow-pink">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownloadSingle(index)
                  }}
                  disabled={downloadingIndex === index}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm
                    flex items-center justify-center
                    text-white/70 hover:text-white hover:bg-brand-pink/60
                    disabled:opacity-40
                    transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {downloadingIndex === index ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDownloadSelected}
              disabled={selectedIndices.size === 0 || downloadingAll}
              className="ripple-effect flex-1 py-3 rounded-xl font-bold text-sm tracking-wider
                bg-gradient-to-r from-brand-cyan to-brand-cyan-dark
                text-brand-black
                shadow-glow-cyan
                disabled:opacity-30 disabled:shadow-none
                hover:brightness-110
                active:scale-[0.98]
                transition-all duration-200
                flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloadingAll
                ? '下载中...'
                : selectedIndices.size > 0
                  ? `下载选中 (${selectedIndices.size})`
                  : '选择图片下载'}
            </button>

            <button
              onClick={() => setSelectedIndices(new Set(data.images.map((_, i) => i)))}
              className="py-3 px-4 rounded-xl text-sm font-medium
                bg-white/5 text-white/50 border border-white/10
                hover:text-white/70 hover:border-white/20
                transition-all duration-200
                flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4" />
              全选
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}