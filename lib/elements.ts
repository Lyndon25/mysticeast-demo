import { ElementData, ElementType } from '@/types';

export const elementData: Record<ElementType, ElementData> = {
  wood: {
    id: 'wood',
    name: 'Wood',
    nameZh: '木',
    archetype: 'The Growth Pioneer',
    keywords: ['Vision', 'Vitality', 'Expansion'],
    color: '#22c55e',
    gradient: 'from-green-500/20 to-emerald-600/20',
    description: 'Like the spring bamboo reaching toward the sky, you possess an innate drive to grow, expand, and pioneer new paths. Your energy is forward-moving, always seeking higher ground.',
    symbol: '木',
  },
  fire: {
    id: 'fire',
    name: 'Fire',
    nameZh: '火',
    archetype: 'The Radiant Inspirer',
    keywords: ['Passion', 'Transformation', 'Clarity'],
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-600/20',
    description: 'Like a flame that dances with endless energy, you radiate warmth and inspiration wherever you go. Your presence illuminates dark corners and ignites transformation in others.',
    symbol: '火',
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    nameZh: '土',
    archetype: 'The Grounded Guardian',
    keywords: ['Stability', 'Nurturing', 'Reliability'],
    color: '#d97706',
    gradient: 'from-amber-500/20 to-yellow-600/20',
    description: 'Like the fertile soil that nourishes all life, you provide stability and grounding to those around you. Your reliability is the foundation upon which others build their dreams.',
    symbol: '土',
  },
  metal: {
    id: 'metal',
    name: 'Metal',
    nameZh: '金',
    archetype: 'The Strategic Architect',
    keywords: ['Precision', 'Discipline', 'Mastery'],
    color: '#a8a29e',
    gradient: 'from-gray-400/20 to-slate-500/20',
    description: 'Like refined gold or forged steel, you possess clarity of purpose and unwavering discipline. Your precision cuts through confusion, revealing the elegant structure beneath chaos.',
    symbol: '金',
  },
  water: {
    id: 'water',
    name: 'Water',
    nameZh: '水',
    archetype: 'The Intuitive Explorer',
    keywords: ['Wisdom', 'Adaptability', 'Depth'],
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    description: 'Like the deep ocean or a flowing river, you navigate life with intuitive wisdom and graceful adaptability. Your depth reveals hidden truths that others overlook.',
    symbol: '水',
  },
};

export const elementArchetypeNames: Record<ElementType, string> = {
  wood: 'The Growth Pioneer',
  fire: 'The Radiant Inspirer',
  earth: 'The Grounded Guardian',
  metal: 'The Strategic Architect',
  water: 'The Intuitive Explorer',
};

export function getElementDescription(element: ElementType, polarity: string): string {
  const data = elementData[element];
  const polarityText = polarity === 'yin' 
    ? 'Your inner energy is receptive and introspective, drawing strength from quiet contemplation.'
    : 'Your inner energy is active and expressive, projecting your influence outward into the world.';
  
  return `${data.description} ${polarityText}`;
}
