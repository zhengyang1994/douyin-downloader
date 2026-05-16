import { Check } from 'lucide-react'
import type { VideoResolution } from '../../shared/types'
import { useAppStore } from '../store/useAppStore'

interface ResolutionSelectorProps {
  resolutions: VideoResolution[]
}

export default function ResolutionSelector({ resolutions }: ResolutionSelectorProps) {
  const selectedResolution = useAppStore((s) => s.selectedResolution)
  const setSelectedResolution = useAppStore((s) => s.setSelectedResolution)

  return (
    <div className="mt-4">
      <p className="text-xs text-white/40 mb-2 font-medium tracking-wider uppercase">
        选择分辨率
      </p>
      <div className="flex flex-wrap gap-2">
        {resolutions.map((res) => {
          const isSelected = selectedResolution === res.label
          return (
            <button
              key={res.label}
              onClick={() => setSelectedResolution(res.label)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-r from-brand-pink/20 to-brand-pink/10 text-brand-pink border border-brand-pink/40 shadow-[0_0_12px_rgba(255,0,80,0.2)]'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70'
                }`}
            >
              <span>{res.label}</span>
              {isSelected && (
                <Check className="w-3.5 h-3.5 inline ml-1.5 text-brand-pink" />
              )}
              <span className="block text-[10px] text-white/30 mt-0.5">
                {res.width}x{res.height}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}