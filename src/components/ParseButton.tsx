import { Zap, Loader2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { parseDouyinUrl } from '../utils/api'

export default function ParseButton() {
  const inputUrl = useAppStore((s) => s.inputUrl)
  const isLoading = useAppStore((s) => s.isLoading)
  const setLoading = useAppStore((s) => s.setLoading)
  const setParseResult = useAppStore((s) => s.setParseResult)
  const setError = useAppStore((s) => s.setError)
  const setSelectedResolution = useAppStore((s) => s.setSelectedResolution)

  const handleParse = async () => {
    if (!inputUrl.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await parseDouyinUrl(inputUrl.trim())

      if (response.success) {
        setParseResult(response.data)
        if (response.data.type === 'video' && response.data.resolutions.length > 0) {
          setSelectedResolution(response.data.resolutions[0].label)
        }
      } else {
        setError(response.error)
      }
    } catch {
      setError('网络错误，请检查网络连接后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 mt-4">
      <button
        onClick={handleParse}
        disabled={isLoading || !inputUrl.trim()}
        className="ripple-effect w-full py-3.5 rounded-xl font-bold text-sm tracking-wider
          bg-gradient-to-r from-brand-pink to-brand-pink-dark
          text-white shadow-glow-pink
          disabled:opacity-40 disabled:shadow-none
          hover:shadow-glow-pink hover:brightness-110
          active:scale-[0.98]
          transition-all duration-200
          flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            解析中...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            解析链接
          </>
        )}
      </button>
    </div>
  )
}