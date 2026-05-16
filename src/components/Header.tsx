import { Music3 } from 'lucide-react'

export default function Header() {
  return (
    <header className="pt-8 pb-6 px-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Music3 className="w-7 h-7 text-brand-pink" />
        <h1 className="text-3xl font-black bg-gradient-to-r from-brand-pink via-brand-pink to-brand-cyan bg-clip-text text-transparent">
          抖音下载器
        </h1>
      </div>
      <p className="text-sm text-white/40 tracking-wider">
        粘贴链接，一键下载抖音视频与图片
      </p>
      <div className="mt-4 mx-auto w-12 h-0.5 bg-gradient-to-r from-brand-pink to-brand-cyan rounded-full opacity-60" />
    </header>
  )
}