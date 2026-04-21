/**
 * MysticEast AI - Bazi Engine (simplified inline version)
 */

import { ElementType, Polarity, TianGan, DiZhi, TenGod, Pillar, BaziResult } from '@/types';
import { elementData } from './elements';

const TIAN_GAN: TianGan[] = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DI_ZHI: DiZhi[] = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const GAN_ELEMENT: Record<TianGan, { element: ElementType; polarity: Polarity }> = {
  '甲':{element:'wood',polarity:'yang'},'乙':{element:'wood',polarity:'yin'},
  '丙':{element:'fire',polarity:'yang'},'丁':{element:'fire',polarity:'yin'},
  '戊':{element:'earth',polarity:'yang'},'己':{element:'earth',polarity:'yin'},
  '庚':{element:'metal',polarity:'yang'},'辛':{element:'metal',polarity:'yin'},
  '壬':{element:'water',polarity:'yang'},'癸':{element:'water',polarity:'yin'},
};

const ZHI_ELEMENT: Record<DiZhi, ElementType> = {
  '子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth','巳':'fire',
  '午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water',
};

const ZHI_HIDDEN_GAN: Record<DiZhi, TianGan[]> = {
  '子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],
  '辰':['戊','乙','癸'],'巳':['丙','庚','戊'],'午':['丁','己'],'未':['己','丁','乙'],
  '申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲'],
};

function createPillar(gan: TianGan, zhi: DiZhi, position: Pillar['position']): Pillar {
  return {
    gan: { gan, ...GAN_ELEMENT[gan] },
    zhi: { zhi, element: ZHI_ELEMENT[zhi], hiddenGan: ZHI_HIDDEN_GAN[zhi] },
    position,
  };
}

export function getTenGod(dayGan: TianGan, targetGan: TianGan): TenGod {
  const d = GAN_ELEMENT[dayGan];
  const t = GAN_ELEMENT[targetGan];
  const gen: Record<ElementType, ElementType> = { wood:'fire', fire:'earth', earth:'metal', metal:'water', water:'wood' };
  const ov: Record<ElementType, ElementType> = { wood:'earth', earth:'water', water:'fire', fire:'metal', metal:'wood' };
  if (t.element === d.element) return d.polarity === t.polarity ? '比肩' : '劫财';
  if (gen[d.element] === t.element) return d.polarity === t.polarity ? '食神' : '伤官';
  if (gen[t.element] === d.element) return d.polarity === t.polarity ? '偏印' : '正印';
  if (ov[d.element] === t.element) return d.polarity === t.polarity ? '偏财' : '正财';
  return d.polarity === t.polarity ? '七杀' : '正官';
}

function getZhiTenGod(dayGan: TianGan, zhi: DiZhi): TenGod {
  return getTenGod(dayGan, ZHI_HIDDEN_GAN[zhi][0]);
}

export function calculateBazi(birthDate: string, birthTime: string): BaziResult {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour] = birthTime.split(':').map(Number);
  const solarDate = new Date(year, month - 1, day, hour);

  // simplified lunar
  let lunarYear = year;
  const lunarMonth = month;
  if (month < 2 || (month === 2 && day < 4)) lunarYear--;

  const yearGan = TIAN_GAN[(lunarYear - 4) % 10];
  const yearZhi = DI_ZHI[(lunarYear - 4) % 12];
  const monthZhi = DI_ZHI[(lunarMonth + 1) % 12];
  const mgMap: Record<number, number> = { 0:2,5:2,1:4,6:4,2:6,7:6,3:8,8:8,4:0,9:0 };
  const monthGan = TIAN_GAN[(mgMap[TIAN_GAN.indexOf(yearGan)] + lunarMonth - 1) % 10];

  const base = new Date(1900, 0, 31);
  const diffDays = Math.floor((solarDate.getTime() - base.getTime()) / 86400000);
  const dayPillar = { gan: TIAN_GAN[(diffDays) % 10], zhi: DI_ZHI[(10 + diffDays) % 12] };

  const hourZhi = DI_ZHI[Math.floor(((hour + 1) % 24) / 2)];
  const hgMap: Record<number, number> = { 0:0,5:0,1:2,6:2,2:4,7:4,3:6,8:6,4:8,9:8 };
  const hourGan = TIAN_GAN[(hgMap[TIAN_GAN.indexOf(dayPillar.gan)] + DI_ZHI.indexOf(hourZhi)) % 10];

  const fourPillars = {
    year: createPillar(yearGan, yearZhi, 'year'),
    month: createPillar(monthGan, monthZhi, 'month'),
    day: createPillar(dayPillar.gan as TianGan, dayPillar.zhi as DiZhi, 'day'),
    hour: createPillar(hourGan, hourZhi, 'hour'),
  };

  const dayMaster = fourPillars.day.gan;
  const tenGods = {
    yearGan: getTenGod(dayMaster.gan, fourPillars.year.gan.gan),
    yearZhi: getZhiTenGod(dayMaster.gan, fourPillars.year.zhi.zhi),
    monthGan: getTenGod(dayMaster.gan, fourPillars.month.gan.gan),
    monthZhi: getZhiTenGod(dayMaster.gan, fourPillars.month.zhi.zhi),
    hourGan: getTenGod(dayMaster.gan, fourPillars.hour.gan.gan),
    hourZhi: getZhiTenGod(dayMaster.gan, fourPillars.hour.zhi.zhi),
  };

  const balance: Record<ElementType, number> = { wood:0, fire:0, earth:0, metal:0, water:0 };
  for (const p of [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]) {
    balance[p.gan.element] += 1;
    const hg = ZHI_HIDDEN_GAN[p.zhi.zhi];
    for (let i = 0; i < hg.length; i++) balance[GAN_ELEMENT[hg[i]].element] += (i === 0 ? 1 : i === 1 ? 0.6 : 0.3);
  }

  let score = 0;
  const gen2: Record<ElementType, ElementType> = { wood:'fire', fire:'earth', earth:'metal', metal:'water', water:'wood' };
  if (fourPillars.month.zhi.element === dayMaster.element) score += 3;
  else if (gen2[fourPillars.month.zhi.element] === dayMaster.element) score += 2;
  for (const p of [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour]) {
    for (const g of ZHI_HIDDEN_GAN[p.zhi.zhi]) { if (GAN_ELEMENT[g].element === dayMaster.element) { score += 1; break; } }
  }
  for (const g of [fourPillars.year.gan, fourPillars.month.gan, fourPillars.hour.gan]) {
    if (g.element === dayMaster.element) score += 1;
  }
  const strength: 'strong' | 'weak' | 'neutral' = score >= 5 ? 'strong' : score <= 2 ? 'weak' : 'neutral';

  const e = dayMaster.element;
  const gb: Record<ElementType, ElementType> = { wood:'water', fire:'wood', earth:'fire', metal:'earth', water:'metal' };
  const ov2: Record<ElementType, ElementType> = { wood:'earth', earth:'water', water:'fire', fire:'metal', metal:'wood' };
  const ob: Record<ElementType, ElementType> = { wood:'metal', fire:'water', earth:'wood', metal:'fire', water:'earth' };
  let favorable: ElementType[], unfavorable: ElementType[], favorableGods: TenGod[];
  if (strength === 'strong') {
    favorable = [ov2[e], gb[e], ob[e]]; unfavorable = [e, gen2[e]]; favorableGods = ['正官','七杀','食神','伤官','偏财','正财'];
  } else if (strength === 'weak') {
    favorable = [gb[e], e]; unfavorable = [ob[e], ov2[e]]; favorableGods = ['正印','偏印','比肩','劫财'];
  } else {
    const entries = Object.entries(balance) as [ElementType, number][];
    favorable = [entries.sort((a,b) => a[1]-b[1])[0][0]];
    unfavorable = [entries.sort((a,b) => b[1]-a[1])[0][0]];
    favorableGods = ['正官','正印'];
  }

  const mArchetype: Record<string, Record<string, string>> = {
    '正官':{wood:'The Principled Leader',fire:'The Charismatic Guide',earth:'The Reliable Steward',metal:'The Disciplined Strategist',water:'The Wise Mediator'},
    '七杀':{wood:'The Fearless Challenger',fire:'The Passionate Warrior',earth:'The Resilient Builder',metal:'The Sharp Conqueror',water:'The Deep Strategist'},
    '正印':{wood:'The Nurturing Sage',fire:'The Warm Mentor',earth:'The Grounded Teacher',metal:'The Precise Scholar',water:'The Intuitive Healer'},
    '偏印':{wood:'The Visionary Mystic',fire:'The Creative Rebel',earth:'The Unconventional Guide',metal:'The Independent Thinker',water:'The Dreamy Explorer'},
    '比肩':{wood:'The Growth Pioneer',fire:'The Radiant Inspirer',earth:'The Grounded Guardian',metal:'The Strategic Architect',water:'The Intuitive Explorer'},
    '劫财':{wood:'The Dynamic Pioneer',fire:'The Energetic Transformer',earth:'The Loyal Protector',metal:'The Bold Achiever',water:'The Resourceful Navigator'},
    '食神':{wood:'The Creative Visionary',fire:'The Joyful Performer',earth:'The Nurturing Creator',metal:'The Refined Artist',water:'The Flowing Poet'},
    '伤官':{wood:'The Expressive Innovator',fire:'The Daring Performer',earth:'The Artistic Groundbreaker',metal:'The Brilliant Critic',water:'The Unconventional Genius'},
    '正财':{wood:'The Practical Builder',fire:'The Enthusiastic Provider',earth:'The Steady Accumulator',metal:'The Methodical Planner',water:'The Adaptable Resource Manager'},
    '偏财':{wood:'The Opportunistic Grower',fire:'The Risk-taking Visionary',earth:'The Generous Provider',metal:'The Sharp Investor',water:'The Fluid Opportunist'},
  };
  const personalityArchetype = mArchetype[tenGods.monthGan]?.[dayMaster.element] || 'The Balanced Soul';

  const element = dayMaster.element;
  const polarity = dayMaster.polarity;
  const data = elementData[element];
  const polarityLabel = polarity === 'yin' ? 'Yin' : 'Yang';

  return {
    fourPillars, dayMaster, tenGods, elementBalance: balance, strength,
    favorableElements: favorable, unfavorableElements: unfavorable, favorableGods,
    personalityArchetype,
    element, polarity, archetype: personalityArchetype,
    keywords: data.keywords, color: data.color,
    description: `You are ${polarityLabel} ${data.name} (${dayMaster.gan}${fourPillars.day.zhi.zhi}) - ${personalityArchetype}. ${data.description}`,
  };
}

export function formatBazi(bazi: BaziResult): string {
  const { year, month, day, hour } = bazi.fourPillars;
  return `${year.gan.gan}${year.zhi.zhi} ${month.gan.gan}${month.zhi.zhi} ${day.gan.gan}${day.zhi.zhi} ${hour.gan.gan}${hour.zhi.zhi}`;
}

export function getTenGodEnglish(god: TenGod): string {
  const m: Record<TenGod, string> = { '比肩':'Companion','劫财':'Competitor','食神':'Output','伤官':'Intelligence','偏财':'Indirect Wealth','正财':'Direct Wealth','七杀':'Challenge','正官':'Authority','偏印':'Unconventional Resource','正印':'Resource' };
  return m[god];
}

export function getElementEnglish(element: ElementType): string {
  const m: Record<ElementType, string> = { wood:'Wood',fire:'Fire',earth:'Earth',metal:'Metal',water:'Water' };
  return m[element];
}

export function getStrengthDescription(strength: 'strong' | 'weak' | 'neutral', locale: 'en' | 'zh' = 'en'): string {
  const d = {
    strong: {
      en: 'Your Day Master energy is strong and vibrant. You naturally assert yourself and can handle pressure well. Your challenge is to channel this energy constructively rather than overwhelming others.',
      zh: '你的日主能量强旺有力。你天生自信，能够承受压力。你的挑战在于建设性地引导这股能量，而不是让它压倒他人。',
    },
    weak: {
      en: 'Your Day Master energy is gentle and receptive. You thrive with support and collaboration. Your strength lies in adaptability and listening to your intuition. Building self-confidence is your growth edge.',
      zh: '你的日主能量柔和内敛。你在支持和协作中茁壮成长。你的力量在于适应力和倾听直觉。建立自信是你成长的课题。',
    },
    neutral: {
      en: 'Your Day Master energy is well-balanced. You can adapt to both leadership and supportive roles. This versatility is a gift, though you may sometimes feel pulled in different directions.',
      zh: '你的日主能量平衡适中。你能够适应领导和辅助两种角色。这种多才多艺是天赋，尽管你有时会感到被不同方向拉扯。',
    },
  };
  return d[strength][locale];
}
