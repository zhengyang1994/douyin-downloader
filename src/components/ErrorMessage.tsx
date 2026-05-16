import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="px-5 mt-4 animate-fade-in">
      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-300 leading-relaxed">{message}</p>
      </div>
    </div>
  )
}