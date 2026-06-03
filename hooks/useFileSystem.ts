import { Channel } from '@/types/lofi'

const DB_NAME = 'next-beats-fs'
const DB_VERSION = 1
const STORE_NAME = 'fileHandles'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbSet(key: string, value: unknown): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function dbDelete(key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Persist a file handle keyed by channel name+filename
export async function saveFileHandle(
  channelKey: string,
  handle: FileSystemFileHandle
): Promise<void> {
  await dbSet(`fh:${channelKey}`, handle)
}

export async function loadFileHandle(
  channelKey: string
): Promise<FileSystemFileHandle | undefined> {
  return dbGet<FileSystemFileHandle>(`fh:${channelKey}`)
}

export async function deleteFileHandle(channelKey: string): Promise<void> {
  await dbDelete(`fh:${channelKey}`)
}

// Given a stored file handle, verify permission and return a fresh blob URL
export async function resolveBlobUrl(
  handle: FileSystemFileHandle
): Promise<string | null> {
  try {
    const permission = await (handle as any).requestPermission({ mode: 'read' })
if (permission !== 'granted') return null
    const file = await handle.getFile()
    return URL.createObjectURL(file)
  } catch {
    return null
  }
}

export function fileHandleKey(channel: Channel): string {
  return `${channel.name}::${channel.localFileName ?? ''}`
}