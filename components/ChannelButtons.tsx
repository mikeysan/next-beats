import { Channel } from '@/types/lofi'

interface ChannelButtonsProps {
  channels: Channel[]
  currentChannel: number
  setCurrentChannel: (index: number) => void
  currentTheme: string
  allChannels: Channel[]
}

export default function ChannelButtons({
  channels,
  currentChannel,
  setCurrentChannel,
  currentTheme,
  allChannels,
}: ChannelButtonsProps) {
  const handleChannelClick = (channel: Channel) => {
    const globalIndex = allChannels.findIndex(
      (c) => c.name === channel.name && c.url === channel.url
    )
    if (globalIndex !== -1) {
      setCurrentChannel(globalIndex)
    }
  }

  const isPlaying = (channel: Channel) => {
    const currentObj = allChannels[currentChannel]
    return currentObj?.name === channel.name && currentObj?.url === channel.url
  }

  return (
    <div
      className="
        grid 
        grid-cols-2          /* 2 columns on very small screens */
        sm:grid-cols-3      /* 3 columns on small screens */
        md:grid-cols-4      /* 4 columns on medium screens */
        lg:grid-cols-6      /* 6 columns on large screens (Max) */
        gap-3               /* Space between grid items */
        w-full
      "
    >
      {channels.map((channel, idx) => (
        <button
          key={`${channel.name}-${idx}`}
          onClick={() => handleChannelClick(channel)}
          className={`
            w-full
            flex items-center justify-center /* Center text vertically and horizontally */
            px-2 py-3            /* Increased vertical padding for wrapped text */
            rounded-lg
            text-sm font-medium
            text-center
            whitespace-normal    /* Allows text to wrap to new lines */
            break-words          /* Breaks long words if they exceed width */
            leading-tight        /* Tightens line height for wrapped text */
            transition-all
            duration-200
            shadow-sm
            hover:shadow-md
            ${
              isPlaying(channel)
                ? 'bg-[var(--lofi-accent)] text-white shadow-[var(--lofi-accent)]/50 scale-105'
                : 'bg-[var(--lofi-card-hover)] text-[var(--lofi-text-secondary)] hover:bg-[var(--lofi-button-hover)] hover:text-[var(--lofi-text-primary)]'
            }
          `}
        >
          {channel.name}
        </button>
      ))}
    </div>
  )
}