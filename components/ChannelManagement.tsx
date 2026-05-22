import React from 'react'
import { Edit2, X, Plus, Save } from 'lucide-react'
import { Channel } from '@/types/lofi'

interface ChannelManagementProps {
  isAddingChannel: boolean
  setIsAddingChannel: (adding: boolean) => void
  newChannel: Channel
  setNewChannel: (channel: Channel) => void
  saveChannel: () => void
  currentTheme: string
  currentChannel: number          // index in allChannels
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
  return (
    <>
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
        /* Add New Channel Modal */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--lofi-card)] p-6 shadow-xl">
            <h3 className="mb-5 text-xl font-bold text-[var(--lofi-text-primary)]">
              Add New Channel
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Channel Name"
                value={newChannel.name}
                onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                className="w-full rounded-xl bg-[var(--lofi-card-hover)] px-4 py-3 text-[var(--lofi-text-primary)]"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={newChannel.url}
                onChange={(e) => setNewChannel({ ...newChannel, url: e.target.value })}
                className="w-full rounded-xl bg-[var(--lofi-card-hover)] px-4 py-3 text-[var(--lofi-text-primary)]"
              />
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
                onClick={() => setIsAddingChannel(false)}
                className="px-5 py-2 text-[var(--lofi-text-secondary)] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChannel}
                className="flex items-center gap-2 rounded-xl bg-[var(--lofi-accent)] px-5 py-2 text-white hover:brightness-110"
              >
                <Save size={16} />
                Save Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChannelManagement