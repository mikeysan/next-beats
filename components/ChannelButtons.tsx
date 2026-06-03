import { Channel } from '@/types/lofi'
import { Edit2, X } from 'lucide-react'

interface ChannelButtonsProps {
  channels: Channel[]                    // filtered channels
  currentChannel: number                 // global index in allChannels
  setCurrentChannel: (index: number) => void
  currentTheme: string
  allChannels: Channel[]
  onEdit?: (filteredIndex: number) => void      // NEW
  onDelete?: (filteredIndex: number) => void    // NEW
}

export default function ChannelButtons({
  channels,
  currentChannel,
  setCurrentChannel,
  currentTheme,
  allChannels,
  onEdit,
  onDelete,
}: ChannelButtonsProps) {

  const handleChannelClick = (channel: Channel) => {
    const globalIndex = allChannels.findIndex(
      (c) => c.name === channel.name &&
        (c.url === channel.url || (c.sourceType === 'local' && c.localFileName === channel.localFileName))
    )
    if (globalIndex !== -1) setCurrentChannel(globalIndex)
  }

  const isPlaying = (channel: Channel) => {
    const currentObj = allChannels[currentChannel]
    return currentObj?.name === channel.name &&
      (currentObj?.url === channel.url || (currentObj?.sourceType === 'local' && currentObj?.localFileName === channel.localFileName))
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 w-full">
      {channels.map((channel, filteredIndex) => (
        <div key={`${channel.name}-${filteredIndex}`} className="group relative">
          <button
            onClick={() => handleChannelClick(channel)}
            className={`
              w-full h-full min-h-[52px]
              flex items-center justify-center
              px-3 py-3 rounded-xl
              text-sm font-medium text-center
              whitespace-normal break-words leading-tight
              transition-all duration-200
              shadow-sm hover:shadow-md
              ${isPlaying(channel)
                ? 'bg-[var(--lofi-accent)] text-white shadow-[var(--lofi-accent)]/50 scale-[1.02]'
                : 'bg-[var(--lofi-card-hover)] text-[var(--lofi-text-secondary)] hover:bg-[var(--lofi-button-hover)] hover:text-[var(--lofi-text-primary)]'
              }
            `}
          >
            {channel.name}
          </button>

          
          
          
        </div>
      ))}
    </div>
  )
}