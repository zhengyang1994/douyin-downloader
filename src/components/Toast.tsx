import { useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function Toast() {
  const toastMessage = useAppStore((s) => s.toastMessage)
  const toastType = useAppStore((s) => s.toastType)
  const hideToast = useAppStore((s) => s.hideToast)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        hideToast()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage, hideToast])

  if (!toastMessage) return null

  const isSuccess = toastType === 'success'

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg backdrop-blur-md border text-sm font-medium
          ${isSuccess
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
        {toastMessage}
      </div>
    </div>
  )
}