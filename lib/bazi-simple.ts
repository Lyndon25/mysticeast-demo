import { ElementType, Polarity, ElementResult } from '@/types';
import { elementData } from './elements';

// 简化五行映射：根据年份尾数
const yearElementMap: Record<number, ElementType> = {
  0: 'metal',
  1: 'metal',
  2: 'water',
  3: 'water',
  4: 'wood',
  5: 'wood',
  6: 'fire',
  7: 'fire',
  8: 'earth',
  9: 'earth',
};

export function getElementFromYear(year: number): ElementType {
  const lastDigit = year % 10;
  return yearElementMap[lastDigit];
}

export function getPolarityFromDay(day: number): Polarity {
  return day % 2 === 0 ? 'yin' : 'yang';
}

export function calculateElement(birthDate: string): ElementResult {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const day = date.getDate();
  
  const element = getElementFromYear(year);
  const polarity = getPolarityFromDay(day);
  const data = elementData[element];
  
  const polarityLabel = polarity === 'yin' ? 'Yin' : 'Yang';
  
  return {
    element,
    polarity,
    archetype: data.archetype,
    keywords: data.keywords,
    color: data.color,
    description: `You are ${polarityLabel} ${data.name} — ${data.archetype}. ${data.description}`,
  };
}

export function getPolarityDescription(polarity: Polarity): string {
  if (polarity === 'yin') {
    return 'Yin energy is receptive, introspective, and nurturing. You draw strength from inner reflection and create deep, lasting connections.';
  }
  return 'Yang energy is active, expressive, and dynamic. You project your influence outward and thrive in leadership and creative endeavors.';
}
