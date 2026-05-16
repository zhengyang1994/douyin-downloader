export function sanitizeFilename(name: string, maxLen = 80): string {
  let clean = name.replace(/[\\/:*?"<>|]/g, '_')
  clean = clean.replace(/[\x00-\x1f\x80-\x9f]/g, '')
  clean = clean.trim()
  if (clean.length > maxLen) {
    clean = clean.slice(0, maxLen)
  }
  return clean || 'download'
}

let _idCounter = 0

export function generateId(): string {
  return `dl_${Date.now()}_${++_idCounter}_${Math.random().toString(36).slice(2, 8)}`
}
