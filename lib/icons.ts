import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

export type FamilyKey =
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Ionicons'
  | 'Feather'
  | 'Entypo'
  | 'AntDesign';

export interface FamilyDef {
  key: FamilyKey;
  label: string;
  blurb: string;
  accent: string;
  font: Record<string, number>;
  glyphMap: Record<string, string | number>;
  Component: React.ComponentType<any>;
}

export interface IconDef {
  id: string;
  name: string;
  family: FamilyKey;
  familyLabel: string;
  pretty: string;
  search: string;
  unicode: string;
  category: string;
  accent: string;
}

const COMPONENTS: Record<FamilyKey, React.ComponentType<any>> = {
  MaterialCommunityIcons: MaterialCommunityIcons as unknown as React.ComponentType<any>,
  MaterialIcons: MaterialIcons as unknown as React.ComponentType<any>,
  Ionicons: Ionicons as unknown as React.ComponentType<any>,
  Feather: Feather as unknown as React.ComponentType<any>,
  Entypo: Entypo as unknown as React.ComponentType<any>,
  AntDesign: AntDesign as unknown as React.ComponentType<any>,
};

export { COMPONENTS };

const RAW_FAMILIES: { key: FamilyKey; label: string; blurb: string; accent: string }[] = [
  {
    key: 'MaterialCommunityIcons',
    label: 'Extended',
    blurb: 'The full material-icons-extended library',
    accent: '#6C4DF6',
  },
  { key: 'MaterialIcons', label: 'Material', blurb: 'Google Material core icons', accent: '#0EA5E9' },
  { key: 'Ionicons', label: 'Ionicons', blurb: 'Crisp icons by the Expo team', accent: '#10B981' },
  { key: 'Feather', label: 'Feather', blurb: 'Beautiful open-source line icons', accent: '#F59E0B' },
  { key: 'Entypo', label: 'Entypo', blurb: 'Handcrafted design classics', accent: '#F43F5E' },
  { key: 'AntDesign', label: 'Ant Design', blurb: 'Icons from the Ant ecosystem', accent: '#EC4899' },
];

export const FAMILIES: FamilyDef[] = RAW_FAMILIES.map((fam) => ({
  ...fam,
  font: (COMPONENTS[fam.key] as any).font,
  glyphMap: (COMPONENTS[fam.key] as any).glyphMap as Record<string, string | number>,
  Component: COMPONENTS[fam.key],
}));

export const FAMILY_ACCENT: Record<FamilyKey, string> = FAMILIES.reduce(
  (acc, fam) => ({ ...acc, [fam.key]: fam.accent }),
  {} as Record<FamilyKey, string>
);

export const FAMILY_LABEL: Record<FamilyKey, string> = FAMILIES.reduce(
  (acc, fam) => ({ ...acc, [fam.key]: fam.label }),
  {} as Record<FamilyKey, string>
);

function prettyName(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function composeName(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const CATEGORY_RULES: [string, string[]][] = [
  ['Emoji', ['emoji', 'emoticon', 'mood', 'sticker']],
  ['Arrows', ['arrow', 'chevron', 'gesture']],
  [
    'People',
    [
      'account',
      'person',
      'user',
      'people',
      'human',
      'face',
      'profile',
      'child',
      'male',
      'female',
      'family',
      'badge',
      'handshake',
      'agent',
      'hard-hat',
      'crew',
      'run',
      'walk',
      'karate',
      'levitate',
      'registration',
    ],
  ],
  [
    'Communication',
    [
      'mail',
      'email',
      'message',
      'chat',
      'comment',
      'bell',
      'notification',
      'send',
      'inbox',
      'reply',
      'sms',
      'phone',
      'call',
      'voicemail',
      'at-sign',
      'forum',
      'announcement',
      'contacts',
      'mailbox',
    ],
  ],
  [
    'Media & AV',
    [
      'play',
      'pause',
      'music',
      'video',
      'film',
      'camera',
      'image',
      'photo',
      'microphone',
      'head',
      'speaker',
      'volume',
      'audio',
      'record',
      'rewind',
      'television',
      'radio',
      'podcast',
      'equalizer',
      'metronome',
      'lyric',
      'blur',
      'crop',
      'tune',
      'karaoke',
      'disc',
      'playlist',
      'cinema',
      'subtitle',
      'theater',
      'projector',
      'remote',
      'vibrate',
      'microphone-variant',
      'earpiece',
    ],
  ],
  [
    'Files & Data',
    [
      'file',
      'folder',
      'document',
      'note',
      'page',
      'clipboard',
      'archive',
      'box',
      'download',
      'upload',
      'save',
      'trash',
      'delete',
      'printer',
      'scan',
      'pdf',
      'database',
      'storage',
      'table',
      'spreadsheet',
      'chart',
      'analytics',
      'graph',
      'report',
      'data',
      'cloud-upload',
      'cloud-download',
      'cloud-sync',
      'cloud-check',
      'excel',
      'zip',
      'export',
      'import',
      'content-save',
    ],
  ],
  [
    'Text & Writing',
    [
      'text',
      'font',
      'format',
      'alphabet',
      'translate',
      'pencil',
      'pen',
      'edit',
      'highlighter',
      'marker',
      'signature',
      'letter',
      'spell',
      'typography',
      'quote',
      'heading',
      'indent',
      'drawing',
    ],
  ],
  [
    'Devices',
    [
      'mobile',
      'tablet',
      'laptop',
      'desktop',
      'computer',
      'monitor',
      'keyboard',
      'mouse',
      'server',
      'router',
      'hard-drive',
      'usb',
      'bluetooth',
      'wifi',
      'wired',
      'memory',
      'chip',
      'cpu',
      'device',
      'gamepad',
      'vr',
      'oculus',
      'robot',
      'satellite',
      'antenna',
      'power-plug',
      'battery',
      'charger',
      'headset',
      'sim',
      'smartphone',
      'ipad',
      'imac',
      'apple-keyboard',
      'nintendo',
      'playstation',
      'xbox',
    ],
  ],
  [
    'Transport',
    [
      'car',
      'bus',
      'train',
      'plane',
      'bicycle',
      'boat',
      'ship',
      'rocket',
      'truck',
      'motorbike',
      'subway',
      'ferry',
      'traffic',
      'road',
      'helicopter',
      'scooter',
      'tractor',
      'anchor',
      'parking',
      'gasoline',
      'wheel',
      'steering',
      'airplane',
      'flight',
      'parachute',
      'caravan',
      'shuttle',
      'taxi',
      'jeep',
      'garage',
      'bridge',
    ],
  ],
  [
    'Weather',
    [
      'weather',
      'sun',
      'moon',
      'cloud',
      'rain',
      'snow',
      'storm',
      'thunder',
      'umbrella',
      'wind',
      'fog',
      'hail',
      'temperature',
      'thermometer',
      'celsius',
      'fahrenheit',
      'degree',
      'humid',
      'lightning',
      'tornado',
      'hurricane',
      'sunset',
      'sunrise',
    ],
  ],
  [
    'Nature',
    [
      'leaf',
      'tree',
      'plant',
      'flower',
      'seed',
      'forest',
      'earth',
      'globe',
      'world',
      'terrain',
      'mountain',
      'water',
      'ocean',
      'river',
      'island',
      'mushroom',
      'cactus',
      'grass',
      'nature',
      'eco',
      'recycle',
      'park',
      'wave',
      'snowflake',
      'stone',
      'sprout',
    ],
  ],
  [
    'Animals',
    [
      'dog',
      'cat',
      'paw',
      'bird',
      'fish',
      'bug',
      'insect',
      'butterfly',
      'ant',
      'frog',
      'snake',
      'turtle',
      'dolphin',
      'shark',
      'lion',
      'horse',
      'rabbit',
      'duck',
      'chicken',
      'cow',
      'pig',
      'goat',
      'sheep',
      'whale',
      'octopus',
      'bee',
      'mosquito',
      'spider',
      'lizard',
      'elephant',
      'monkey',
      'dinosaur',
      'hamster',
      'squirrel',
      'wolf',
      'fox',
      'bear',
      'crab',
      'snail',
      'worm',
      'larva',
      'pelican',
      'flamingo',
      'Kangaroo',
    ],
  ],
  [
    'Food & Drink',
    [
      'food',
      'pizza',
      'burger',
      'coffee',
      'tea',
      'beer',
      'wine',
      'drink',
      'cake',
      'cookie',
      'fruit',
      'apple',
      'banana',
      'carrot',
      'egg',
      'bread',
      'cheese',
      'meat',
      'kitchen',
      'chef',
      'cutlery',
      'spoon',
      'fork',
      'knife',
      'popcorn',
      'honey',
      'salt',
      'pepper',
      'bbq',
      'barbecue',
      'sausage',
      'noodle',
      'rice',
      'sushi',
      'ice-',
      'candy',
      'beverage',
      'cup',
      'mug',
      'grill',
      'lemon',
      'orange',
      'corn',
      'peanut',
      'watermelon',
      'grapes',
      'pineapple',
      'avocado',
      'toaster',
    ],
  ],
  [
    'Health & Fitness',
    [
      'medical',
      'health',
      'hospital',
      'pill',
      'medicine',
      'doctor',
      'stethoscope',
      'bandage',
      'ambulance',
      'virus',
      'bacteria',
      'dna',
      'syringe',
      'therapy',
      'brain',
      'lungs',
      'tooth',
      'heart-pulse',
      'heartbeat',
      'pulse',
      'fitness',
      'gym',
      'dumbbell',
      'yoga',
      'exercise',
      'weight',
      'body',
      'organ',
      'iv-bag',
      'microscope',
      'wheelchair',
      'accessibility',
      'sick',
      'allergy',
      'band-aid',
      'massage',
      'spa',
    ],
  ],
  [
    'Finance',
    [
      'money',
      'dollar',
      'euro',
      'coin',
      'cash',
      'bank',
      'wallet',
      'card',
      'credit',
      'payment',
      'stock',
      'trade',
      'calculator',
      'percent',
      'currency',
      'pound',
      'yen',
      'bitcoin',
      'atm',
      'piggy',
      'salary',
      'interest',
      'safe',
    ],
  ],
  [
    'Shopping',
    [
      'cart',
      'basket',
      'shop',
      'store',
      'buy',
      'sell',
      'order',
      'tag',
      'price',
      'sale',
      'gift',
      'receipt',
      'barcode',
      'scanner',
      'package',
      'delivery',
      'shopping',
      'commerce',
      'coupon',
      'discount',
      'purchase',
      'storefront',
    ],
  ],
  [
    'Security',
    [
      'lock',
      'unlock',
      'shield',
      'key',
      'password',
      'fingerprint',
      'secure',
      'surveillance',
      'cctv',
      'police',
      'gavel',
      'scales',
      'alert',
      'warning',
      'danger',
      'emergency',
      'radar',
      'hand-back',
      'verified',
    ],
  ],
  [
    'Time',
    [
      'clock',
      'time',
      'calendar',
      'schedule',
      'alarm',
      'timer',
      'hourglass',
      'date',
      'stopwatch',
      'history',
      'hour',
    ],
  ],
  [
    'Shapes & Design',
    [
      'shape',
      'circle',
      'square',
      'triangle',
      'hexagon',
      'polygon',
      'vector',
      'border',
      'geometry',
      'diamond',
      'pentagon',
      'sphere',
      'cube',
      'rectangle',
      'oval',
      'grid',
      'layout',
      'dashboard',
      'window',
      'color',
      'palette',
      'design',
      'art',
      'brush',
      'paint',
      'draw',
      'pattern',
      'dot',
      'line',
      'hexagon',
      'sphere',
    ],
  ],
  [
    'Math & Dev',
    [
      'sigma',
      'equation',
      'function',
      'infinity',
      'radical',
      'numeric',
      'code',
      'json',
      'xml',
      'terminal',
      'bug',
      'git',
      'github',
      'dev',
      'nodejs',
      'react',
      'wordpress',
      'language',
      'brackets',
      'console',
      'api',
      'math',
      'plus-box',
      'minus-box',
    ],
  ],
  [
    'Social',
    [
      'heart',
      'star',
      'like',
      'thumb',
      'share',
      'social',
      'follow',
      'facebook',
      'twitter',
      'instagram',
      'linkedin',
      'snapchat',
      'whatsapp',
      'telegram',
      'reddit',
      'discord',
      'twitch',
      'tiktok',
      'pinterest',
      'behance',
      'dribbble',
      'slack',
      'skype',
      'spotify',
      'steam',
      'microsoft',
      'google',
      'apple',
      'ubuntu',
      'android',
      'ios',
      'linux',
      'gitlab',
      'npm',
      'medium',
      'xing',
      'meetup',
      'group',
      'creation',
    ],
  ],
];

function categorize(name: string): string {
  const lower = name.toLowerCase();
  for (const [category, keywords] of CATEGORY_RULES) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return category;
    }
  }
  return 'Misc';
}

const ICONS_BUILD: IconDef[] = [];
const FAMILY_COUNTS: Record<string, number> = {};

for (const family of FAMILIES) {
  const names = Object.keys(family.glyphMap).sort();
  FAMILY_COUNTS[family.key] = names.length;
  for (const name of names) {
    const codePoint = family.glyphMap[name];
    if (typeof codePoint !== 'number') continue;
    const pretty = prettyName(name);
    ICONS_BUILD.push({
      id: `${family.key}:${name}`,
      name,
      family: family.key,
      familyLabel: family.label,
      pretty,
      search: `${name} ${pretty} ${family.label}`.toLowerCase(),
      unicode: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      category: categorize(name),
      accent: family.accent,
    });
  }
}

export const ICONS: IconDef[] = ICONS_BUILD;
export const TOTAL_ICONS = ICONS.length;
export { FAMILY_COUNTS };

export const ICON_INDEX: Record<string, IconDef> = ICONS.reduce(
  (acc, icon) => {
    acc[icon.id] = icon;
    return acc;
  },
  {} as Record<string, IconDef>
);

export function findIcon(id: string | undefined | null): IconDef | undefined {
  if (!id) return undefined;
  return ICON_INDEX[id];
}

const FAMILY_ICONS: Record<string, IconDef[]> = { all: ICONS };
for (const family of FAMILIES) {
  FAMILY_ICONS[family.key] = ICONS.filter((icon) => icon.family === family.key);
}

export function iconsForFamily(family: FamilyKey | 'all'): IconDef[] {
  return FAMILY_ICONS[family] ?? ICONS;
}

export interface CategoryCount {
  key: string;
  count: number;
}

export const CATEGORIES: CategoryCount[] = (() => {
  const counts = new Map<string, number>();
  for (const icon of ICONS) counts.set(icon.category, (counts.get(icon.category) ?? 0) + 1);
  const list = Array.from(counts, ([key, count]) => ({ key, count }));
  list.sort((a, b) => {
    if (a.key === 'Misc') return 1;
    if (b.key === 'Misc') return -1;
    return a.key.localeCompare(b.key);
  });
  return list;
})();

export function searchIcons(query: string, pool: IconDef[]): IconDef[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return pool;
  const tokens = trimmed.split(/\s+/);
  const results: IconDef[] = [];
  for (const icon of pool) {
    let matches = true;
    for (const token of tokens) {
      if (!icon.search.includes(token)) {
        matches = false;
        break;
      }
    }
    if (matches) results.push(icon);
  }
  return results;
}

export function relatedTo(icon: IconDef, limit: number): IconDef[] {
  const pool = ICONS.filter((candidate) => candidate.category === icon.category && candidate.id !== icon.id);
  if (pool.length <= limit) return pool;
  const step = Math.max(1, Math.floor(pool.length / limit));
  const picked: IconDef[] = [];
  for (let i = 0; i < pool.length && picked.length < limit; i += step) picked.push(pool[i]);
  return picked;
}
