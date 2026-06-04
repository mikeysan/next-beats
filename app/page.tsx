'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { X, Save, Settings } from 'lucide-react'

import styles from '@/styles/Lofi.module.css'

import { soundEffects, DEFAULT_CHANNELS, getAllCategories } from '@/lib/lofi_data'
import ChannelButtons from '@/components/ChannelButtons'
import PlaybackControls from '@/components/PlaybackControls'
import ChannelManagement from '@/components/ChannelManagement'
import SoundEffectsControls from '@/components/SoundEffectsControls'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Channel, CustomSoundEffect } from '@/types/lofi'
import SettingsModal from '@/components/SettingsModal'
import { saveFileHandle, loadFileHandle, deleteFileHandle, resolveBlobUrl, fileHandleKey } from '@/hooks/useFileSystem'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

const StaticEffect = () => {
  const [staticPoints, setStaticPoints] = useState<{ left: string; top: string; opacity: number }[]>([])

  useEffect(() => {
    setStaticPoints(Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5,
    })))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-screen">
      {staticPoints.map((point, i) => (
        <div key={i} className="absolute h-px w-px bg-white" style={point} />
      ))}
    </div>
  )
}

const EnhancedLofiPlayer = () => {
  const [mounted, setMounted] = useState(false)
  const [currentChannel, setCurrentChannel] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useLocalStorage('lofi-volume', 0.7)
  const [played, setPlayed] = useState(0)
  const [currentTheme, setCurrentTheme] = useLocalStorage<string>('lofi-theme', 'light')
  const [effectsVolume, setEffectsVolume] = useLocalStorage('lofi-effects-volume', 0.5)
  const [customChannels, setCustomChannels] = useLocalStorage<Channel[]>('customChannels', [])
  const [hiddenDefaultChannels, setHiddenDefaultChannels] = useLocalStorage<number[]>('hiddenDefaultChannels', [])
  const [effectVolumes, setEffectVolumes] = useLocalStorage<{ [key: string]: number }>(
    'lofi-effect-volumes',
    Object.fromEntries(soundEffects.map((effect) => [effect.id, 0.5]))
  )
  const [customEffects, setCustomEffects] = useLocalStorage<CustomSoundEffect[]>('customSoundEffects', [])

  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const playerRef = useRef<any>(null)
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set())
  const [isAddingChannel, setIsAddingChannel] = useState(false)
  const [newChannel, setNewChannel] = useState<Channel>({ name: '', url: '', category: '', isCustom: true })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [isEditingChannel, setIsEditingChannel] = useState<number | null>(null)
  const [editingChannel, setEditingChannel] = useState<Channel>({ name: '', url: '', category: '', isCustom: true })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const isBrowser = typeof window !== 'undefined'

  useEffect(() => { if (isBrowser) setMounted(true) }, [isBrowser])

  useEffect(() => {
    const saved = localStorage.getItem('lofi-theme') || 'light'
    document.documentElement.dataset.theme = saved
    setCurrentTheme(saved)
  }, [])

  const allChannels = useMemo<Channel[]>(() => {
    const visibleDefaults = DEFAULT_CHANNELS.map((ch, idx) => ({
      ...ch,
      isCustom: false,
      originalIndex: idx,
    })).filter((_, idx) => !hiddenDefaultChannels.includes(idx))

    return [...visibleDefaults, ...customChannels]
  }, [customChannels, hiddenDefaultChannels])

  const filteredChannels = useMemo(() => {
    if (selectedCategory === 'All') return allChannels
    return allChannels.filter(c => c.category === selectedCategory)
  }, [allChannels, selectedCategory])

  const categories = useMemo(() => ['All', ...getAllCategories(allChannels)], [allChannels])

  const getRealIndex = (filteredIndex: number): number => {
    if (selectedCategory === 'All') return filteredIndex
    const channel = filteredChannels[filteredIndex]
    if (!channel) return -1
    return allChannels.findIndex(c =>
      c.name === channel.name &&
      (c.url === channel.url || (c.sourceType === 'local' && c.localFileName === channel.localFileName))
    )
  }

  const toggleEffect = (effectId: string) => {
    setActiveEffects(prev => {
      const n = new Set(prev)
      n.has(effectId) ? n.delete(effectId) : n.add(effectId)
      return n
    })
  }

  const handleProgress = (state: { played: number }) => {
    if (!isPlaying) return
    setPlayed(state.played)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    
  }

  const handleVolumeChange = (v: number) => setVolume(v)
  const handleEffectsVolumeChange = (v: number) => setEffectsVolume(v)
  const handleThemeChange = (theme: string) => setCurrentTheme(theme)

  const changeChannel = (direction: 'next' | 'prev') => {
    setCurrentChannel(prev => direction === 'next' 
      ? (prev + 1) % allChannels.length 
      : (prev - 1 + allChannels.length) % allChannels.length)
  }

  


// Replace handleSaveChannel:
const handleSaveChannel = async () => {
  if (!newChannel.name || !newChannel.url) return alert('Name and URL required')

  const channelToSave = { ...newChannel, isCustom: true }

  // Persist file handle to IndexedDB for local files
  if (channelToSave.sourceType === 'local' && channelToSave.fileHandle) {
    await saveFileHandle(fileHandleKey(channelToSave), channelToSave.fileHandle)
  }

  // Don't store the fileHandle or blob URL in localStorage —
  // strip them out, we'll rehydrate from IndexedDB on load
  const { fileHandle, url, ...rest } = channelToSave
  const toStore = channelToSave.sourceType === 'local'
    ? { ...rest, url: '', localFileName: channelToSave.localFileName }
    : channelToSave

  setCustomChannels([...customChannels, toStore])
  setIsAddingChannel(false)
  setNewChannel({ name: '', url: '', category: '', isCustom: true })
}

// Add this effect to rehydrate blob URLs for local channels on mount:
const [needsPermission, setNeedsPermission] = useState(false)

const rehydrated = useRef(false)

useEffect(() => {
  if (!mounted || rehydrated.current) return
  rehydrated.current = true
  const hasLocal = customChannels.some(c => c.sourceType === 'local' && !c.url)
  if (hasLocal) setNeedsPermission(true)
}, [mounted])

const handleRestoreLocalFiles = async () => {
  setNeedsPermission(false)
  const updated = await Promise.all(
    customChannels.map(async (ch) => {
      if (ch.sourceType !== 'local' || ch.url) return ch
      const handle = await loadFileHandle(fileHandleKey(ch))
      if (!handle) return ch
      const blobUrl = await resolveBlobUrl(handle)
      return blobUrl ? { ...ch, url: blobUrl } : ch
    })
  )
  setCustomChannels(updated)
}




const handleDeleteChannel = async (globalIndex: number) => {
  console.log('handleDeleteChannel called with:', globalIndex, 'channel:', allChannels[globalIndex])
  const channelToDelete = allChannels[globalIndex]
  if (!channelToDelete) return

  if (channelToDelete.sourceType === 'local') {
    if (channelToDelete.url?.startsWith('blob:')) URL.revokeObjectURL(channelToDelete.url)
    await deleteFileHandle(fileHandleKey(channelToDelete))
  }

  if (channelToDelete.isCustom) {
    setCustomChannels(customChannels.filter(c =>
      !(c.name === channelToDelete.name &&
        (c.localFileName
          ? c.localFileName === channelToDelete.localFileName
          : c.url === channelToDelete.url))
    ))
  } else if (typeof channelToDelete.originalIndex === 'number') {
    setHiddenDefaultChannels([...hiddenDefaultChannels, channelToDelete.originalIndex])
  }

  if (globalIndex === currentChannel) setCurrentChannel(0)
  setShowDeleteConfirm(null)
}

const handleEditChannel = (globalIndex: number) => {
  const channel = allChannels[globalIndex]
 
  if (channel) {
    setEditingChannel({ ...channel })
    setIsEditingChannel(globalIndex)
  }
}

  const handleSaveEditedChannel = () => {
    if (!editingChannel.name || !editingChannel.url) {
      alert('Name and URL are required.')
      return
    }

    if (allChannels[isEditingChannel!]?.isCustom) {
      const customIndex = customChannels.findIndex(c => 
        c.name === allChannels[isEditingChannel!].name && c.url === allChannels[isEditingChannel!].url
      )
      if (customIndex !== -1) {
        const updated = [...customChannels]
        updated[customIndex] = { ...editingChannel, isCustom: true }
        setCustomChannels(updated)
      }
    } else {
      setCustomChannels([...customChannels, { ...editingChannel, isCustom: true }])
      if (typeof allChannels[isEditingChannel!].originalIndex === 'number') {
        setHiddenDefaultChannels([...hiddenDefaultChannels, allChannels[isEditingChannel!].originalIndex!])
      }
    }

    setIsEditingChannel(null)
  }

  const currentUrl = allChannels[currentChannel]?.url || ''
  const isLocal = allChannels[currentChannel]?.sourceType === 'local'
  
  
  return (
    <div className={styles['theme-container']} data-theme={mounted ? currentTheme : 'dark'}>
      <div className="flex min-h-screen w-full justify-center bg-[var(--lofi-background)] p-4 sm:p-8">
        <div className="w-full max-w-[1280px] space-y-8">
        {needsPermission && (
  <div className="flex items-center justify-between rounded-xl bg-[var(--lofi-accent)]/10 border border-[var(--lofi-accent)]/30 px-4 py-3">
    <span className="text-sm text-[var(--lofi-text-primary)]">
      Local files need permission to play
    </span>
    <button
      onClick={handleRestoreLocalFiles}
      className="rounded-lg bg-[var(--lofi-accent)] px-4 py-1.5 text-sm text-white hover:brightness-110"
    >
      Restore Files
    </button>
  </div>
)}

          {/* Video Player */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border-4 border-[var(--lofi-border)] bg-black shadow-2xl">
            {mounted && <StaticEffect />}
            {mounted && (
              <ReactPlayer
              ref={playerRef}
              url={currentUrl}
              playing={isPlaying}
              volume={volume}
              
              loop
              width="100%"
              height="100%"
              onProgress={handleProgress}
              config={{
                youtube: {
                  playerVars: { controls: 0, modestbranding: 1, iv_load_policy: 3, rel: 0 }
                },
                file: {
                  forceVideo: true,
                  attributes: {
                    controlsList: 'nodownload',
                  }
                }
              }}
            />
            )}
          </div>

          

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Channels - 2/3 */}
            <div className="lg:col-span-2 rounded-2xl bg-[var(--lofi-card)] p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-semibold text-[var(--lofi-text-primary)]" >Channels</h3>
                <button onClick={() => setIsSettingsOpen(true)}><Settings size={24} /></button>
              </div>

              {mounted && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedCategory === cat ? 'bg-[var(--lofi-accent)] text-white' : 'text-[var(--lofi-text-primary)] border-[var(--lofi-border)] hover:border-[var(--lofi-accent)]'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {mounted && (
                <ChannelButtons
                  channels={filteredChannels}
                  currentChannel={currentChannel}
                  setCurrentChannel={setCurrentChannel}
                  currentTheme={currentTheme}
                  allChannels={allChannels}
                  onEdit={handleEditChannel}
                  onDelete={handleDeleteChannel}
                />
              )}

              <div className="mt-6 space-y-4">
                <PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} volume={volume} setVolume={handleVolumeChange} changeChannel={changeChannel} />

                <div className="h-1.5 w-full rounded-full bg-[var(--lofi-card-hover)] overflow-hidden">
                  <div className="h-full bg-[var(--lofi-accent)] transition-all" style={{ width: `${played * 100}%` }} />
                </div>

                <ChannelManagement
                  isAddingChannel={isAddingChannel}
                  setIsAddingChannel={setIsAddingChannel}
                  newChannel={newChannel}
                  setNewChannel={setNewChannel}
                  saveChannel={handleSaveChannel}
                  currentTheme={currentTheme}
                  currentChannel={currentChannel}
                  handleEditChannel={handleEditChannel}
                  setShowDeleteConfirm={handleDeleteChannel}
                />
              </div>
            </div>

            {/* Sound Effects - 1/3 */}
            <div className="lg:col-span-1 rounded-2xl bg-[var(--lofi-card)] p-6">
              {mounted && (
                <SoundEffectsControls
                  activeEffects={activeEffects}
                  toggleEffect={toggleEffect}
                  effectsVolume={effectsVolume}
                  setEffectsVolume={handleEffectsVolumeChange}
                  effectVolumes={effectVolumes}
                  setEffectVolumes={setEffectVolumes}
                  currentTheme={currentTheme}
                  customEffects={customEffects}
                  setCustomEffects={setCustomEffects}
                  loadingEffects={new Set()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditingChannel !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--lofi-card)] p-6">
            <h3 className="mb-4 text-lg font-bold">Edit Channel</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Channel Name" value={editingChannel.name} onChange={(e) => setEditingChannel({...editingChannel, name: e.target.value})} className="w-full rounded-lg bg-[var(--lofi-card-hover)] px-4 py-3" />
              <input type="text" placeholder="YouTube URL" value={editingChannel.url} onChange={(e) => setEditingChannel({...editingChannel, url: e.target.value})} className="w-full rounded-lg bg-[var(--lofi-card-hover)] px-4 py-3" />
              <input type="text" placeholder="Category" value={editingChannel.category} onChange={(e) => setEditingChannel({...editingChannel, category: e.target.value})} className="w-full rounded-lg bg-[var(--lofi-card-hover)] px-4 py-3" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsEditingChannel(null)} className="px-5 py-2">Cancel</button>
              <button onClick={handleSaveEditedChannel} className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-white">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--lofi-card)] p-6">
            <h3 className="mb-4 text-lg font-bold">Delete Channel</h3>
            <p className="mb-6">Are you sure you want to delete this channel?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2">Cancel</button>
              <button onClick={() => handleDeleteChannel(showDeleteConfirm)} className="rounded-full bg-red-600 px-5 py-2 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        setCurrentTheme={handleThemeChange}
      />
    </div>
  )
}

export default EnhancedLofiPlayer