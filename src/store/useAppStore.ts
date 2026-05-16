import { create } from 'zustand'
import type { AppState, DownloadItem, ParseResult } from '../../shared/types'
import { generateId } from '../utils/helpers'

export const useAppStore = create<AppState>((set) => ({
  inputUrl: '',
  isLoading: false,
  parseResult: null,
  error: null,
  selectedResolution: null,
  downloadItems: [],
  toastMessage: null,
  toastType: null,

  setInputUrl: (url) => set({ inputUrl: url }),
  setParseResult: (result: ParseResult | null) => set({ parseResult: result, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, parseResult: null }),
  setSelectedResolution: (label) => set({ selectedResolution: label }),

  addToQueue: (item) =>
    set((state) => ({
      downloadItems: [
        {
          id: generateId(),
          filename: item.filename,
          url: item.url,
          type: item.type,
          status: 'queued',
          progress: 0,
        } as DownloadItem,
        ...state.downloadItems,
      ],
    })),

  updateDownloadItem: (id, updates) =>
    set((state) => ({
      downloadItems: state.downloadItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeDownloadItem: (id) =>
    set((state) => ({
      downloadItems: state.downloadItems.filter((item) => item.id !== id),
    })),

  clearCompletedDownloads: () =>
    set((state) => ({
      downloadItems: state.downloadItems.filter((item) => item.status !== 'completed'),
    })),

  retryDownload: (id) =>
    set((state) => ({
      downloadItems: state.downloadItems.map((item) =>
        item.id === id
          ? { ...item, status: 'queued' as const, progress: 0, errorMessage: undefined }
          : item
      ),
    })),

  showToast: (message, type) => set({ toastMessage: message, toastType: type }),
  hideToast: () => set({ toastMessage: null, toastType: null }),
  reset: () =>
    set({
      inputUrl: '',
      parseResult: null,
      error: null,
      selectedResolution: null,
    }),
}))
