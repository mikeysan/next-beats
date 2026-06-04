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
import { SoundEffect } from '@/types/lofi'
import { CloudRain } from 'lucide-react'

export type Channel = {
  name: string;
  url: string;
  category: string;        
};

export const DEFAULT_CHANNELS: Channel[] = [
  {
    name: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    category: 'lofi',
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
    name: 'Best nasheeds',
    url: 'https://www.youtube.com/watch?v=01pk6vlysb4&list=RD01pk6vlysb4',
    category: 'nasheed',
  },
  {
    name: 'Anime lofi',
    url: 'https://www.youtube.com/watch?v=xTG7ir1NXqg',
    category: 'lofi',
  },
  {
    name: 'Japan Cafe Vibe',
    url: 'https://www.youtube.com/watch?v=bRnTGbr3E',
    category: 'lofi',
  },
  {
    name: 'avb tomorrowland 2016',
    url: 'https://www.youtube.com/watch?v=YjfZGw-2-zc',
    category: 'edm',
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

export const soundEffects: SoundEffect[] = [
  {
    id: 'rain',
    name: '',
    file: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    icon: CloudRain,
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