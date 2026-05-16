import { create } from 'zustand'
import type { AppState, ParseResult } from '../../shared/types'

export const useAppStore = create<AppState>((set) => ({
  inputUrl: '',
  isLoading: false,
  parseResult: null,
  error: null,
  selectedResolution: null,
  downloadProgress: 0,
  toastMessage: null,
  toastType: null,

  setInputUrl: (url) => set({ inputUrl: url }),
  setParseResult: (result: ParseResult | null) => set({ parseResult: result, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, parseResult: null }),
  setSelectedResolution: (label) => set({ selectedResolution: label }),
  setDownloadProgress: (progress) => set({ downloadProgress: progress }),
  showToast: (message, type) => set({ toastMessage: message, toastType: type }),
  hideToast: () => set({ toastMessage: null, toastType: null }),
  reset: () => set({
    inputUrl: '',
    parseResult: null,
    error: null,
    selectedResolution: null,
    downloadProgress: 0,
  }),
}))