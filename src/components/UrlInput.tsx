import { ClipboardPaste, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function UrlInput() {
  const inputUrl = useAppStore((s) => s.inputUrl)
  const setInputUrl = useAppStore((s) => s.setInputUrl)
  const isLoading = useAppStore((s) => s.isLoading)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputUrl(text)
    } catch {
      const input = document.querySelector<HTMLInputElement>('#douyin-url-input')
      if (input) {
        input.focus()
        document.execCommand('paste')
      }
    }
  }

  const handleClear = () => {
    setInputUrl('')
  }

  return (
    <div className="px-5">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-pink/30 to-brand-cyan/30 rounded-2xl blur opacity-50 group-focus-within:opacity-80 transition-opacity duration-300" />
        <div className="relative flex items-center bg-brand-black border border-white/10 rounded-2xl overflow-hidden focus-within:border-brand-pink/50 transition-colors duration-300">
          <input
            id="douyin-url-input"
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="在此粘贴抖音分享链接..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-white/25 px-4 py-3.5 text-sm outline-none disabled:opacity-50"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {inputUrl && (
            <button
              onClick={handleClear}
              className="p-2 text-white/30 hover:text-white/60 transition-colors"
              aria-label="清除"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-2 mr-1 text-brand-pink hover:text-brand-cyan transition-colors text-xs font-medium"
            aria-label="粘贴"
          >
            <ClipboardPaste className="w-4 h-4" />
            <span className="hidden sm:inline">粘贴</span>
          </button>
        </div>
      </div>
    </div>
  )
}