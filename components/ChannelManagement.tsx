import React, { useState, useRef } from 'react'
import { Edit2, X, Plus, Save, Youtube, FolderOpen } from 'lucide-react'
import { Channel } from '@/types/lofi'
import { saveFileHandle, resolveBlobUrl, fileHandleKey } from '@/hooks/useFileSystem'

interface ChannelManagementProps {
  isAddingChannel: boolean
  setIsAddingChannel: (adding: boolean) => void
  newChannel: Channel
  setNewChannel: (channel: Channel) => void
  saveChannel: () => void
  currentTheme: string
  currentChannel: number
  handleEditChannel: (index: number) => void
  setShowDeleteConfirm: (channelIndex: number) => void
}

const ChannelManagement: React.FC<ChannelManagementProps> = ({
  isAddingChannel,
  setIsAddingChannel,
  newChannel,
  setNewChannel,
  saveChannel,
  currentChannel,
  handleEditChannel,
  setShowDeleteConfirm,
}) => {
  const [sourceType, setSourceType] = useState<'youtube' | 'local'>('youtube')
  const [localFileName, setLocalFileName] = useState('')
  const [picking, setPicking] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePickFile = async () => {
    if ('showOpenFilePicker' in window) {
      setPicking(true)
      try {
        const [handle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: 'Audio / Video files',
              accept: {
                'audio/*': ['.mp3', '.flac', '.wav', '.aac', '.ogg', '.m4a'],
                'video/*': ['.mp4', '.webm', '.mkv'],
              },
            },
          ],
          multiple: false,
        })

        const blobUrl = await resolveBlobUrl(handle)
        if (!blobUrl) return

        const fileName = handle.name
        const channelName = newChannel.name || fileName.replace(/\.[^/.]+$/, '')

        setNewChannel({
          ...newChannel,
          name: channelName,
          url: blobUrl,
          sourceType: 'local',
          localFileName: fileName,
          fileHandle: handle,
        })
        setLocalFileName(fileName)
      } catch (err: any) {
        if (err?.name !== 'AbortError') console.error(err)
      } finally {
        setPicking(false)
      }
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (newChannel.url?.startsWith('blob:')) URL.revokeObjectURL(newChannel.url)
    const blobUrl = URL.createObjectURL(file)
    const channelName = newChannel.name || file.name.replace(/\.[^/.]+$/, '')
    setNewChannel({
      ...newChannel,
      name: channelName,
      url: blobUrl,
      sourceType: 'local',
      localFileName: file.name,
    })
    setLocalFileName(file.name)
  }

  const handleSourceTypeSwitch = (type: 'youtube' | 'local') => {
    setSourceType(type)
    if (newChannel.url?.startsWith('blob:')) URL.revokeObjectURL(newChannel.url)
    setLocalFileName('')
    setNewChannel({ ...newChannel, url: '', sourceType: type, fileHandle: undefined, localFileName: undefined })
  }

  const handleCancel = () => {
    if (newChannel.url?.startsWith('blob:')) URL.revokeObjectURL(newChannel.url)
    setSourceType('youtube')
    setLocalFileName('')
    setIsAddingChannel(false)
  }

  return (
    <>
      {/* Hidden fallback input for non-Chrome browsers */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        onChange={handleFallbackFile}
        className="hidden"
      />

      {!isAddingChannel ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditChannel(currentChannel)}
            className="rounded-xl bg-[var(--lofi-button-bg)] p-3 text-[var(--lofi-button-text)] transition-all hover:bg-[var(--lofi-button-hover)] active:scale-95"
            title="Edit Channel"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(currentChannel)}
            className="rounded-xl bg-[var(--lofi-button-bg)] p-3 text-[var(--lofi-button-text)] transition-all hover:bg-red-500/20 hover:text-red-400 active:scale-95"
            title="Delete Channel"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => setIsAddingChannel(true)}
            className="rounded-xl bg-[var(--lofi-accent)] p-3 text-white transition-all hover:brightness-110 active:scale-95"
            title="Add New Channel"
          >
            <Plus size={18} />
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--lofi-card)] p-6 shadow-xl">
            <h3 className="mb-5 text-xl font-bold text-[var(--lofi-text-primary)]">
              Add New Channel
            </h3>

            {/* Toggle */}
            <div className="mb-5 flex rounded-xl bg-[var(--lofi-card-hover)] p-1">
              <button
                onClick={() => handleSourceTypeSwitch('youtube')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                  sourceType === 'youtube'
                    ? 'bg-[var(--lofi-accent)] text-white'
                    : 'text-[var(--lofi-text-secondary)] hover:text-[var(--lofi-text-primary)]'
                }`}
              >
                <Youtube size={15} /> YouTube
              </button>
              <button
                onClick={() => handleSourceTypeSwitch('local')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                  sourceType === 'local'
                    ? 'bg-[var(--lofi-accent)] text-white'
                    : 'text-[var(--lofi-text-secondary)] hover:text-[var(--lofi-text-primary)]'
                }`}
              >
                <FolderOpen size={15} /> Local File
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Channel Name"
                value={newChannel.name}
                onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                className="w-full rounded-xl bg-[var(--lofi-card-hover)] px-4 py-3 text-[var(--lofi-text-primary)]"
              />

              {sourceType === 'youtube' ? (
                <input
                  type="text"
                  placeholder="YouTube URL"
                  value={newChannel.url}
                  onChange={(e) => setNewChannel({ ...newChannel, url: e.target.value })}
                  className="w-full rounded-xl bg-[var(--lofi-card-hover)] px-4 py-3 text-[var(--lofi-text-primary)]"
                />
              ) : (
                <button
                  onClick={handlePickFile}
                  disabled={picking}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    localFileName
                      ? 'bg-[var(--lofi-accent)]/10 text-[var(--lofi-text-primary)]'
                      : 'bg-[var(--lofi-card-hover)] text-[var(--lofi-text-secondary)] hover:text-[var(--lofi-text-primary)]'
                  }`}
                >
                  <FolderOpen size={18} className="shrink-0" />
                  <span className="truncate text-sm">
                    {picking ? 'Opening…' : localFileName || 'Choose audio or video file…'}
                  </span>
                </button>
              )}

              <input
                type="text"
                placeholder="Category (optional)"
                value={newChannel.category}
                onChange={(e) => setNewChannel({ ...newChannel, category: e.target.value })}
                className="w-full rounded-xl bg-[var(--lofi-card-hover)] px-4 py-3 text-[var(--lofi-text-primary)]"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2 text-[var(--lofi-text-secondary)] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChannel}
                disabled={!newChannel.name || !newChannel.url}
                className="flex items-center gap-2 rounded-xl bg-[var(--lofi-accent)] px-5 py-2 text-white hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={16} /> Save Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChannelManagement