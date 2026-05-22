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
// CHANGED 1: Removed 'Channel' from this import to prevent conflict with the local type definition
import { SoundEffect } from '@/types/lofi'

export type Channel = {
  name: string;
  url: string;
  category: string;        
};

export const DEFAULT_CHANNELS: Channel[] = [
 {
    name: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=EWrX250Zhko',
    category:'lofi',
  },
  {
    name: 'Chillhop Radio',
    url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY',
    category: 'chill',
  },
  {
    name: 'Chilled Raccoon',
    url: 'https://www.youtube.com/watch?v=7NOSDKb0HlU',
    category: 'edm',
  },
  {
    name: 'Smooth Jazz',
    url: 'https://www.youtube.com/watch?v=HhqWd3Axq9Y',
    category: 'lofi',
  },
  {
    name: 'Tokyo night drive',
    url: 'https://www.youtube.com/watch?v=Lcdi9O2XB4E',
    category: 'lofi',
  },
  {
    name: 'Japan Cafe Vibe',
    url: 'https://www.youtube.com/watch?v=bRnTGwCbr3E',
    category: 'lofi',
  },
  {
    name: 'Hacker Ambient Radio',
    url: 'https://www.youtube.com/watch?v=5-Xm-Mn_M2k',
    category: 'lofi',
  },
]

export const groupChannelsByCategory = (channels: Channel[]) => {
  return channels.reduce((acc, channel) => {
    const category = channel.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);
};

export const getAllCategories = (channels: Channel[] = DEFAULT_CHANNELS): string[] => {
  const categories = new Set(channels.map(c => c.category));
  return Array.from(categories).sort();
};

// CHANGED 2: Removed the duplicate 'channels' variable, the bad import, and the usage examples below it.
// They were causing the "Cannot find module" and "merged declaration" errors.

export const soundEffects: SoundEffect[] = [
  {
    id: 'rain',
    name: '',
    file: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    icon: Cloud,
  },
  {
    id: 'fire',
    name: '',
    file: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    icon: Flame,
  },
  {
    id: 'cafe',
    name: '',
    file: 'https://www.youtube.com/watch?v=h2zkV-l_TbY',
    icon: Coffee,
  },
  {
    id: 'wind',
    name: '',
    file: 'https://youtu.be/sGkh1W5cbH4?si=L3aMNvyIYASQlYll',
    icon: Wind,
  },
  {
    id: 'birds',
    name: '',
    file: 'https://www.youtube.com/watch?v=Qm846KdZN_c',
    icon: Bird,
  },
  {
    id: 'keyboard',
    name: '',
    file: 'https://youtu.be/-2RiNR2fqRY?si=Er2L4D8MufctAgeE',
    icon: Keyboard,
  },
  {
    id: 'city',
    name: '',
    file: 'https://www.youtube.com/watch?v=8s5H76F3SIs',
    icon: Car,
  },
  {
    id: 'waves',
    name: '',
    file: 'https://www.youtube.com/watch?v=bn9F19Hi1Lk',
    icon: Waves,
  },
  {
    id: 'whitenoise',
    name: '',
    file: 'https://www.youtube.com/watch?v=nMfPqeZjc2c',
    icon: Radio,
  },
]