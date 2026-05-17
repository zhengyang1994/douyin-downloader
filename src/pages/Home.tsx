import { useAppStore } from '../store/useAppStore'
import { useDownloadProcessor } from '../hooks/useDownloadProcessor'
import Header from '../components/Header'
import UrlInput from '../components/UrlInput'
import ParseButton from '../components/ParseButton'
import ErrorMessage from '../components/ErrorMessage'
import VideoResult from '../components/VideoResult'
import ImageResult from '../components/ImageResult'
import DownloadQueue from '../components/DownloadQueue'
import DownloadsPage from '../components/DownloadsPage'
import TabBar from '../components/TabBar'
import Toast from '../components/Toast'

export default function Home() {
  const parseResult = useAppStore((s) => s.parseResult)
  const error = useAppStore((s) => s.error)
  const activeTab = useAppStore((s) => s.activeTab)

  useDownloadProcessor()

  if (activeTab === 'downloads') {
    return (
      <>
        <DownloadsPage />
        <TabBar />
        <Toast />
      </>
    )
  }

  return (
    <div className="min-h-screen min-h-dvh bg-brand-black pb-24">
      <Header />
      <UrlInput />
      <ParseButton />

      {error && <ErrorMessage message={error} />}

      {parseResult && parseResult.type === 'video' && (
        <VideoResult data={parseResult} />
      )}

      {parseResult && parseResult.type === 'image' && (
        <ImageResult data={parseResult} />
      )}

      <DownloadQueue />

      {!parseResult && !error && (
        <div className="px-5 mt-10 text-center">
          <div className="inline-flex flex-col items-center gap-3 opacity-30">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white/20"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </div>
            <p className="text-xs text-white/40">支持抖音视频和图集下载</p>
          </div>
        </div>
      )}

      <TabBar />
      <Toast />
    </div>
  )
}
