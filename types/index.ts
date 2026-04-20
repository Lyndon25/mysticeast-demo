export type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Polarity = 'yin' | 'yang';

export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type TenGod = '比肩' | '劫财' | '食神' | '伤官' | '偏财' | '正财' | '七杀' | '正官' | '偏印' | '正印';

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

/** 简化版五行结果（保留兼容） */
export interface ElementResult {
  element: ElementType;
  polarity: Polarity;
  archetype: string;
  keywords: string[];
  color: string;
  description: string;
}

/** 天干信息 */
export interface GanInfo {
  gan: TianGan;
  element: ElementType;
  polarity: Polarity;
}

/** 地支信息 */
export interface ZhiInfo {
  zhi: DiZhi;
  element: ElementType;
  hiddenGan: TianGan[]; // 地支藏干
}

/** 四柱之一柱 */
export interface Pillar {
  gan: GanInfo;
  zhi: ZhiInfo;
  position: 'year' | 'month' | 'day' | 'hour';
}

/** 完整的八字排盘结果 */
export interface BaziResult {
  fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  dayMaster: GanInfo; // 日主
  tenGods: {
    yearGan: TenGod;
    yearZhi: TenGod;
    monthGan: TenGod;
    monthZhi: TenGod;
    hourGan: TenGod;
    hourZhi: TenGod;
  };
  elementBalance: Record<ElementType, number>;
  strength: 'strong' | 'weak' | 'neutral';
  favorableElements: ElementType[];
  unfavorableElements: ElementType[];
  favorableGods: TenGod[];
  personalityArchetype: string;
  // 兼容旧版
  element: ElementType;
  polarity: Polarity;
  archetype: string;
  keywords: string[];
  color: string;
  description: string;
}

export interface AIReport {
  overview: string;
  personality: string;
  career: string;
  love: string;
  health: string;
  forecast: string;
  advice: string;
}

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface DivinationRecord {
  id: string;
  timestamp: number;
  question: string;
  hexagram: HexagramResult;
  interpretation: string;
}

export interface HexagramResult {
  mainHexagram: number;
  mainName: string;
  mainNameEn: string;
  changedHexagram: number;
  changedName: string;
  changedNameEn: string;
  changingLines: number[];
  lineText: string[];
}
