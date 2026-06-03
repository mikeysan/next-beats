export interface Channel {
  originalIndex?: number
  name: string
  url: string
  category: string
  isCustom?: boolean
  sourceType?: 'youtube' | 'local'
  fileHandle?: FileSystemFileHandle   // persisted in IndexedDB
  localFileName?: string
}

export interface SoundEffect {
  id: string
  name: string
  file: string
  icon: any
  isCustom?: boolean
}

export interface CustomSoundEffect {
  id: string
  name: string
  file: string
}
