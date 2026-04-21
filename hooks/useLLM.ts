'use client';

import { useState, useCallback } from 'react';
import { AIReport, BaziResult } from '@/types';
import { elementData } from '@/lib/elements';

interface UseLLMReturn {
  generateReport: (params: {
    baziResult: BaziResult;
    birthDate: string;
    birthTime: string;
    locale?: 'en' | 'zh';
  }) => Promise<AIReport>;
  isLoading: boolean;
  error: string | null;
}

export function useLLM(): UseLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (params: {
    baziResult: BaziResult;
    birthDate: string;
    birthTime: string;
    locale?: 'en' | 'zh';
  }): Promise<AIReport> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      const report = data.report as AIReport;

      // Validate report structure (new 7-section format)
      const required = ['overview', 'personality', 'career', 'love', 'health', 'forecast', 'advice'];
      const missing = required.filter((k) => !(k in report));
      if (missing.length > 0) {
        console.warn('Invalid report structure, using fallback');
        return getFallbackReport(params.baziResult, params.locale || 'en');
      }

      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('LLM Error:', errorMessage);
      // Return fallback on any error
      return getFallbackReport(params.baziResult, params.locale || 'en');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateReport, isLoading, error };
}

// ---- helpers ----

function elZh(el: string): string {
  return { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }[el] || el;
}

function strengthZh(s: string): string {
  return { strong: '身强', weak: '身弱', neutral: '中和' }[s] || s;
}

function elAdviceZh(el: string): string {
  const map: Record<string, string> = {
    wood: '在大自然光线下做几分钟伸展或瑜伽',
    fire: '进行感恩练习或在烛光下写日记',
    earth: '握着石头或水晶做 grounding 冥想',
    metal: '深呼吸练习或简短的正念练习',
    water: '喝一杯水，在窗边静享片刻宁静',
  };
  return map[el] || '';
}

function elColorZh(el: string): string {
  const map: Record<string, string> = {
    wood: '绿色和蓝色',
    fire: '红色和橙色',
    earth: '黄色和棕色',
    metal: '白色、银色和金属色',
    water: '黑色和深蓝色',
  };
  return map[el] || '';
}

function elEnvZh(el: string): string {
  const map: Record<string, string> = {
    wood: '以植物和天然木质纹理为特色',
    fire: '拥有温暖灯光和启发性艺术品',
    earth: '用 earthy 陶瓷和舒适质地营造踏实感',
    metal: '整洁极简，线条利落',
    water: '包含小型水景或反射面',
  };
  return map[el] || '';
}

function elHealthZh(el: string): string {
  const map: Record<string, string> = {
    wood: '在绿色空间进行户外活动，尤其是森林，能补充你的活力。晨间伸展和太极等练习有助能量顺畅流动。',
    fire: '规律的有氧运动和创造性表达让你内心的火焰燃烧明亮。晚间放松仪式对高质量休息至关重要。',
    earth: '赤脚走在草地上、园艺或陶艺等 grounding 练习帮助你稳定能量。一致的作息滋养你的稳定性。',
    metal: '呼吸法、冥想和高海拔活动增强你的内在清明。秋季是你焕新的能量季节。',
    water: '游泳、瑜伽和近水活动恢复你的自然流动。写日记帮助你处理情感暗流。',
  };
  return map[el] || '';
}

function tenGodHintZh(god: string): string {
  if (god === '正官' || god === '七杀') return '领导角色对你来说很自然，在能够引导和激励他人的职位上你会找到深深的满足感。';
  if (god === '正财' || god === '偏财') return '你通过实际行动和为所爱之人创造稳定来表达爱。';
  if (god === '食神' || god === '伤官') return '智性刺激和创造性协作是你理想关系中不可或缺的要素。';
  return '情感深度和共同成长构成了你最充实关系的基础。';
}

function tenGodCareerZh(god: string): string {
  if (god === '正官' || god === '七杀') return '领导角色对你来说很自然，在能够引导和激励他人的职位上你会找到深深的满足感。';
  if (god === '正财' || god === '偏财') return '你的商业头脑让你在需要创新和资源管理的领域如鱼得水。';
  return '你的创造力和分析能力使你非常适合需要创新和新鲜思维的角色。';
}

function careerFieldZh(el: string): string {
  const map: Record<string, string> = {
    wood: '教育、设计、创业或环境领域',
    fire: '营销、娱乐、教练或领导力',
    earth: '医疗、房地产、酒店或项目管理',
    metal: '金融、科技、法律或研究',
    water: '心理学、艺术、外交或战略规划',
  };
  return map[el] || '';
}

function careerTraitZh(s: string): string {
  return {
    strong: '果断天性帮助你主动开创',
    weak: '协作精神让你成为无价的团队一员',
    neutral: '适应能力让你能在变化的环境中茁壮成长',
  }[s] || '';
}

function loveStyleZh(p: string): string {
  return p === 'yang'
    ? '在追求联结和公开表达爱意方面扮演积极角色'
    : '在完全敞开心扉之前深入观察和理解伴侣，创造深刻亲密感的联结';
}

function forecastThemeZh(el: string, fav: string[]): string {
  if (el === 'fire' || fav.includes('fire')) {
    return '能量放大和能见度提升。强火之年与你的天赋对齐，提供闪耀和领导的机会';
  }
  if (el === 'water' || fav.includes('water')) {
    return '流动的机遇和直觉洞察。火年可能挑战你寻找平衡，但你的适应性将其转化为成长';
  }
  return '转变和新的可能。2026 的火能量与你的本性动态互动，创造挑战和突破时刻';
}

function forecastAreaZh(god: string): string {
  if (god === '正官' || god === '七杀') return '事业晋升和公众认可';
  if (god === '正财' || god === '偏财') return '财务增长和资源管理';
  if (god === '食神' || god === '伤官') return '创意项目和自我表达';
  return '学习、教学和个人发展';
}

function loveGodHintZh(gods: string[]): string {
  if (gods.includes('正财') || gods.includes('偏财')) return '你通过实际行动和为所爱之人创造稳定来表达爱。';
  if (gods.includes('食神') || gods.includes('伤官')) return '智性刺激和创造性协作是你理想关系中不可或缺的要素。';
  return '情感深度和共同成长构成了你最充实关系的基础。';
}

// ---- fallback report generator ----

function getFallbackReport(bazi: BaziResult, locale: 'en' | 'zh'): AIReport {
  const {
    element, polarity, strength, favorableElements,
    personalityArchetype, tenGods, elementBalance, favorableGods,
  } = bazi;
  const data = elementData[element];
  const p = polarity === 'yin' ? 'Yin' : 'Yang';
  const s = strength;

  const hasLowElement = Object.entries(elementBalance).some(([_, v]) => v < 1);
  const lowElements = Object.entries(elementBalance)
    .filter(([_, v]) => v < 1)
    .map(([k, _]) => k);

  if (locale === 'zh') {
    const lowElementText = lowElements.length > 0
      ? `你可能受益于在生活中培养更多的${lowElements.map(elZh).join('和')}能量。`
      : '';

    return {
      overview: `你的命盘揭示了一位${p === 'Yin' ? '阴' : '阳'}${elZh(element)}日主 — ${personalityArchetype}。你的能量模式显示出${s === 'strong' ? '强健而果断的本性' : s === 'weak' ? '敏感而适应性强的性情' : '平衡而多才多艺的性格'}。你的喜用神是${favorableElements.map(elZh).join('和')}，它们是你自然的能量来源和焕新之源。${lowElementText} 此洞察仅供娱乐和自我反思之用。`,

      personality: `作为${personalityArchetype}，你的内心世界由日主与命盘中周围能量的互动所塑造。你的${tenGods.monthGan}影响赋予你面对人生挑战的独特方式。${s === 'strong' ? '你自然散发自信，在大多数情况下都能掌控局面。' : s === 'weak' ? '你拥有深刻的敏感性，能够读懂微妙的情感暗流。' : '你优雅地适应不同的社交情境，有时以你的多才多艺让他人惊讶。'} 人们被你的${data.keywords[0]}和${data.keywords[1]}所吸引。考虑探索增强${elZh(favorableElements[0])}元素的练习，以释放你的全部潜力。 此洞察仅供娱乐和自我反思之用。`,

      career: `你的职业道路由你的${elZh(element)}能量和${tenGods.monthGan}才能照亮。${tenGodCareerZh(tenGods.monthGan)} 考虑从事${careerFieldZh(element)}方面的职业。你的${careerTraitZh(s)}，不过记得在野心和自我照顾之间保持平衡。 此洞察仅供娱乐和自我反思之用。`,

      love: `在感情中，你为关心的人带来${data.keywords[0]}和${data.keywords[2]}。你的${p === 'Yin' ? '阴' : '阳'}属性意味着你倾向于${loveStyleZh(polarity)}。你与${favorableElements.map(elZh).join('和')}五行最为和谐共振。${loveGodHintZh(favorableGods)} 记住，最伟大的关系是那些双方相互鼓励对方成长的关系。 此洞察仅供娱乐和自我反思之用。`,

      health: `你的${elZh(element)}体质需要特定的生活方式来滋养。${elHealthZh(element)} ${lowElementText} 通过${elColorZh(favorableElements[0])}来激活你的${elZh(favorableElements[0])}元素。 此洞察仅供娱乐和自我反思之用。`,

      forecast: `2026 年是${forecastThemeZh(element, favorableElements)}的一年。你可能会在${forecastAreaZh(tenGods.monthGan)}领域找到特别的动力。保持对意外方向的开放 —— 你的${personalityArchetype}能量拥有导航一切出现的智慧。相信这段旅程。 此洞察仅供娱乐和自我反思之用。`,

      advice: `以下是五个激活你喜用神${favorableElements.map(elZh).join('/')}能量的日常练习：1）晨间仪式：每天以${elAdviceZh(favorableElements[0])}开始。2）色彩选择：将${elColorZh(favorableElements[0])}融入你的穿搭或工作空间。3）环境布置：创造一个${elEnvZh(element)}的空间。4）关系实践：每周与你信任的人进行一次关于梦想和恐惧的深度对话。5）晚间反思：睡前，认可你今天展现${data.keywords[0]}的一种方式。 此洞察仅供娱乐和自我反思之用。`,
    };
  }

  // English fallback (original)
  const lowElementText = lowElements.length > 0
    ? `You may benefit from cultivating more ${lowElements.join(' and ')} energy in your life.`
    : '';

  return {
    overview: `Your birth chart reveals a ${p} ${element} Day Master — ${personalityArchetype}. Your energy pattern shows ${s === 'strong' ? 'a robust and assertive nature' : s === 'weak' ? 'a receptive and adaptive disposition' : 'a balanced and versatile character'}. Your favorable elements are ${favorableElements.join(' and ')}, which serve as your natural sources of strength and renewal. ${lowElementText} This insight is for entertainment and self-reflection purposes only.`,

    personality: `As a ${personalityArchetype}, your inner world is shaped by the interplay of your Day Master and the surrounding energies in your birth chart. Your ${tenGods.monthGan} influence gives you a distinctive approach to life's challenges. ${s === 'strong' ? 'You naturally project confidence and can take charge in most situations.' : s === 'weak' ? 'You possess deep sensitivity and an ability to read subtle emotional currents.' : 'You adapt gracefully to different social contexts, sometimes surprising others with your versatility.'} People are drawn to your ${data.keywords[0].toLowerCase()} and ${data.keywords[1].toLowerCase()}. Consider exploring practices that enhance your ${favorableElements[0]} element to bring out your fullest potential. This insight is for entertainment and self-reflection purposes only.`,

    career: `Your professional path is illuminated by your ${element} energy and ${tenGods.monthGan} talents. ${favorableGods.includes('正官') || favorableGods.includes('七杀') ? 'Leadership roles come naturally to you, and you may find deep satisfaction in positions where you can guide and inspire others.' : 'Your creative and analytical abilities make you well-suited for roles that require innovation and fresh thinking.'} Consider careers in ${element === 'wood' ? 'education, design, entrepreneurship, or environmental fields' : element === 'fire' ? 'marketing, entertainment, coaching, or leadership' : element === 'earth' ? 'healthcare, real estate, hospitality, or project management' : element === 'metal' ? 'finance, technology, law, or research' : 'psychology, arts, diplomacy, or strategic planning'}. Your ${s === 'strong' ? 'decisive nature helps you take initiative' : s === 'weak' ? 'collaborative spirit makes you an invaluable team player' : 'adaptability allows you to thrive in changing environments'}, though remember to balance ambition with self-care. This insight is for entertainment and self-reflection purposes only.`,

    love: `In relationships, you bring ${data.keywords[0].toLowerCase()} and ${data.keywords[2].toLowerCase()} to those you care about. Your ${p} nature means you tend to ${polarity === 'yang' ? 'take an active role in pursuing connection and expressing affection openly' : 'observe and understand your partner deeply before fully opening up, creating bonds of profound intimacy'}. You harmonize most naturally with ${favorableElements.join(' and ')} elements. ${favorableGods.includes('正财') || favorableGods.includes('偏财') ? 'You show love through practical gestures and creating stability for your loved ones.' : favorableGods.includes('食神') || favorableGods.includes('伤官') ? 'Intellectual stimulation and creative collaboration are essential ingredients in your ideal relationship.' : 'Emotional depth and mutual growth form the foundation of your most fulfilling connections.'} Remember that your greatest relationships will be those where both partners encourage each other's evolution. This insight is for entertainment and self-reflection purposes only.`,

    health: `Your ${element} constitution thrives with specific lifestyle practices. ${element === 'wood' ? 'Outdoor activities in green spaces, especially forests, replenish your vitality. Morning stretching and practices like Tai Chi help your energy flow smoothly.' : element === 'fire' ? 'Regular cardiovascular exercise and creative expression keep your inner flame burning bright. Evening wind-down rituals are essential for quality rest.' : element === 'earth' ? 'Grounding practices like walking barefoot on grass, gardening, or working with clay help center your energy. Consistent routines nourish your stability.' : element === 'metal' ? 'Breathwork, meditation, and activities at higher altitudes strengthen your inner clarity. Autumn is your power season for renewal.' : 'Swimming, yoga, and time near water bodies restore your natural flow. Journaling helps you process emotional undercurrents.'} ${lowElementText} Focus on activating your ${favorableElements[0]} element through ${favorableElements[0] === 'wood' ? 'green foods and nature immersion' : favorableElements[0] === 'fire' ? 'warm colors and social connection' : favorableElements[0] === 'earth' ? 'earthy tones and stable routines' : favorableElements[0] === 'metal' ? 'white/grey palettes and breath practices' : 'blue tones and fluid movement'}. This insight is for entertainment and self-reflection purposes only.`,

    forecast: `2026 is a year of ${element === 'fire' || favorableElements.includes('fire') ? 'amplified energy and visibility for you. The strong Fire year aligns with your natural gifts, offering opportunities to shine and lead' : element === 'water' || favorableElements.includes('water') ? 'flowing opportunities and intuitive insights. The Fire year may challenge you to find balance, but your adaptability turns this into growth' : 'transformation and new possibilities. The Fire energy of 2026 interacts dynamically with your ${element} nature, creating both challenges and breakthrough moments'}. You may find particular momentum in the areas of ${tenGods.monthGan === '正官' || tenGods.monthGan === '七杀' ? 'career advancement and public recognition' : tenGods.monthGan === '正财' || tenGods.monthGan === '偏财' ? 'financial growth and resource management' : tenGods.monthGan === '食神' || tenGods.monthGan === '伤官' ? 'creative projects and self-expression' : 'learning, teaching, and personal development'}. Stay open to unexpected directions — your ${personalityArchetype} energy has the wisdom to navigate whatever arises. Trust the journey. This insight is for entertainment and self-reflection purposes only.`,

    advice: `Here are five daily practices to activate your favorable ${favorableElements.join('/')} energy: 1) Morning Ritual: Begin each day with ${favorableElements[0] === 'wood' ? 'a few minutes of stretching or yoga in natural light' : favorableElements[0] === 'fire' ? 'a gratitude practice or journaling by candlelight' : favorableElements[0] === 'earth' ? 'a grounding meditation while holding a stone or crystal' : favorableElements[0] === 'metal' ? 'deep breathing exercises or a brief mindfulness practice' : 'a glass of water and a moment of stillness by a window'}. 2) Color Palette: Incorporate ${favorableElements[0] === 'wood' ? 'greens and blues' : favorableElements[0] === 'fire' ? 'reds and oranges' : favorableElements[0] === 'earth' ? 'yellows and browns' : favorableElements[0] === 'metal' ? 'whites, silvers, and metallics' : 'blacks and deep blues'} into your wardrobe or workspace. 3) Environment: Create a space that ${element === 'wood' ? 'features plants and natural wood textures' : element === 'fire' ? 'has warm lighting and inspiring artwork' : element === 'earth' ? 'feels grounded with earthy ceramics and comfortable textures' : element === 'metal' ? 'is organized and minimalist with clean lines' : 'includes a small water feature or reflective surfaces'}. 4) Relationship Practice: Each week, have one deep conversation with someone you trust about your dreams and fears. 5) Evening Reflection: Before sleep, acknowledge one way you expressed your ${data.keywords[0].toLowerCase()} today. This insight is for entertainment and self-reflection purposes only.`,
  };
}
