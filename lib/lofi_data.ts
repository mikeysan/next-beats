import {
  Cloud,
  Wind,
  Coffee,
  Flame,
  Bird,
  Radio,
  Keyboard,
  Car,
  Waves,
} from 'lucide-react'
import { Channel, SoundEffect } from '@/types/lofi'

export const DEFAULT_CHANNELS: Channel[] = [
  {
    name: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    description: 'Beats to relax/study to',
    creator: 'Lofi Girl',
  },
  {
    name: 'Chillhop Radio',
    url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY',
    description: 'jazzy & lofi hip hop beats',
    creator: 'Chillhop Music',
  },
  {
    name: 'Chilled Raccoon',
    url: 'https://www.youtube.com/watch?v=7NOSDKb0HlU',
    description: 'late night lofi mix',
    creator: 'Chilled Raccoon',
  },
  {
    name: 'Smooth Jazz',
    url: 'https://www.youtube.com/watch?v=HhqWd3Axq9Y',
    description: 'warm jazz music at coffee shop',
    creator: 'Relax Jazz Cafe',
  },
  {
    name: 'Tokyo night drive',
    url: 'https://www.youtube.com/watch?v=Lcdi9O2XB4E',
    description: 'lofi hiphop + chill + beats',
    creator: 'Tokyo Tones',
  },
  {
    name: 'Japan Cafe Vibe',
    url: 'https://www.youtube.com/watch?v=bRnTGwCbr3E',
    description: 'Lofi Music to sleep,relax,study...',
    creator: 'Healing Me',
  },
  {
    name: 'MATRIX CURRENT Cyberpunk Hacker Ambient Radio',
    url: 'https://www.youtube.com/watch?v=5-Xm-Mn_M2k',
    description: 'Cyberpunk hacker ambient music stream for deep focus, coding and programming...',
    creator: 'Cyberpunk Coding Music',
  },
]

export const channels: Channel[] = [...DEFAULT_CHANNELS]

export const soundEffects: SoundEffect[] = [
  {
    id: 'rain',
    name: 'Rain',
    file: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    icon: Cloud,
  },
  {
    id: 'fire',
    name: 'Fireplace',
    file: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    icon: Flame,
  },
  {
    id: 'cafe',
    name: 'Cafe Ambiance',
    file: 'https://www.youtube.com/watch?v=h2zkV-l_TbY',
    icon: Coffee,
  },
  {
    id: 'wind',
    name: 'Wind',
    file: 'https://youtu.be/sGkh1W5cbH4?si=L3aMNvyIYASQlYll',
    icon: Wind,
  },
  {
    id: 'birds',
    name: 'Birds',
    file: 'https://www.youtube.com/watch?v=Qm846KdZN_c',
    icon: Bird,
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    file: 'https://youtu.be/-2RiNR2fqRY?si=Er2L4D8MufctAgeE',
    icon: Keyboard,
  },
  {
    id: 'city',
    name: 'City Traffic',
    file: 'https://www.youtube.com/watch?v=8s5H76F3SIs',
    icon: Car,
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    file: 'https://www.youtube.com/watch?v=bn9F19Hi1Lk',
    icon: Waves,
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    file: 'https://www.youtube.com/watch?v=nMfPqeZjc2c',
    icon: Radio,
  },
]
