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

/** V2 深度报告八章节结构（三千汉字级） */
export interface AIReport {
  // ===== V2 八章深度结构（优先）=====
  chapter1: string; // 排盘背景与能量场速写
  chapter2: string; // 命盘符号学解构
  chapter3: string; // 五行生克与能量流变
  chapter4: string; // 大运推演与关键节点
  chapter5: string; // 核心困境诊断
  chapter6: string; // 禅修实修指引
  chapter7: string; // 行动方略
  chapter8: string; // 结语与每日心法

  // ===== V1 兼容字段（旧报告可选保留）=====
  overview?: string;
  personality?: string;
  career?: string;
  love?: string;
  health?: string;
  forecast?: string;
  advice?: string;
}

export type ReportChapterKey =
  | 'chapter1' | 'chapter2' | 'chapter3' | 'chapter4'
  | 'chapter5' | 'chapter6' | 'chapter7' | 'chapter8';

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
