export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Polarity = 'yin' | 'yang';

export interface ElementData {
  id: ElementType;
  name: string;
  nameZh: string;
  archetype: string;
  keywords: string[];
  color: string;
  gradient: string;
  description: string;
  symbol: string;
}

export interface BirthInfo {
  date: string;
  time: string;
  location: string;
}

export interface ElementResult {
  element: ElementType;
  polarity: Polarity;
  archetype: string;
  keywords: string[];
  color: string;
  description: string;
}

export interface AIReport {
  career: string;
  love: string;
  health: string;
  forecast: string;
}

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}
