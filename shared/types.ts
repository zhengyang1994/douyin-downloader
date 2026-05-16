export interface VideoResolution {
  label: string
  url: string
  width: number
  height: number
}

export interface VideoResource {
  type: 'video'
  title: string
  cover: string
  duration: number
  author: string
  resolutions: VideoResolution[]
}

export interface ImageItem {
  url: string
  thumb: string
  width: number
  height: number
}

export interface ImageResource {
  type: 'image'
  title: string
  author: string
  images: ImageItem[]
}

export type ParseResult = VideoResource | ImageResource

export interface ParseSuccessResponse {
  success: true
  data: ParseResult
}

export interface ParseErrorResponse {
  success: false
  error: string
}

export type ParseResponse = ParseSuccessResponse | ParseErrorResponse

export type DownloadStatus = 'queued' | 'downloading' | 'completed' | 'error'

export interface DownloadItem {
  id: string
  filename: string
  url: string
  type: 'video' | 'image'
  status: DownloadStatus
  progress: number
  errorMessage?: string
}

export interface AppState {
  inputUrl: string
  isLoading: boolean
  parseResult: ParseResult | null
  error: string | null
  selectedResolution: string | null
  downloadItems: DownloadItem[]
  toastMessage: string | null
  toastType: 'success' | 'error' | null
  setInputUrl: (url: string) => void
  setParseResult: (result: ParseResult | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedResolution: (label: string) => void
  addToQueue: (item: { filename: string; url: string; type: 'video' | 'image' }) => void
  updateDownloadItem: (id: string, updates: Partial<DownloadItem>) => void
  removeDownloadItem: (id: string) => void
  clearCompletedDownloads: () => void
  retryDownload: (id: string) => void
  showToast: (message: string, type: 'success' | 'error') => void
  hideToast: () => void
  reset: () => void
}