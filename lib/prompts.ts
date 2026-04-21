import { BaziResult } from '@/types';
import { elementData } from './elements';

// ==================== 报告生成 Prompt ====================

export interface ReportPromptParams {
  baziResult: BaziResult;
  birthDate: string;
  birthTime: string;
  locale: 'en' | 'zh';
}

/**
 * 生成结构化命理数据JSON（用于传给LLM）
 */
function generateBaziContext(bazi: BaziResult, birthDate: string, birthTime: string): string {
  const { fourPillars, dayMaster, tenGods, elementBalance, strength, favorableElements, unfavorableElements, favorableGods, personalityArchetype } = bazi;
  
  return JSON.stringify({
    userProfile: {
      birthDate,
      birthTime,
    },
    fourPillars: {
      year: {
        gan: `${fourPillars.year.gan.gan} (${fourPillars.year.gan.element}, ${fourPillars.year.gan.polarity})`,
        zhi: `${fourPillars.year.zhi.zhi} (${fourPillars.year.zhi.element})`,
        tenGod: tenGods.yearGan,
      },
      month: {
        gan: `${fourPillars.month.gan.gan} (${fourPillars.month.gan.element}, ${fourPillars.month.gan.polarity})`,
        zhi: `${fourPillars.month.zhi.zhi} (${fourPillars.month.zhi.element})`,
        tenGod: tenGods.monthGan,
      },
      day: {
        gan: `${fourPillars.day.gan.gan} — DAY MASTER (${fourPillars.day.gan.element}, ${fourPillars.day.gan.polarity})`,
        zhi: `${fourPillars.day.zhi.zhi} (${fourPillars.day.zhi.element})`,
      },
      hour: {
        gan: `${fourPillars.hour.gan.gan} (${fourPillars.hour.gan.element}, ${fourPillars.hour.gan.polarity})`,
        zhi: `${fourPillars.hour.zhi.zhi} (${fourPillars.hour.zhi.element})`,
        tenGod: tenGods.hourGan,
      },
    },
    dayMaster: {
      element: dayMaster.element,
      polarity: dayMaster.polarity,
      archetype: personalityArchetype,
    },
    elementBalance: {
      wood: Math.round(elementBalance.wood * 10) / 10,
      fire: Math.round(elementBalance.fire * 10) / 10,
      earth: Math.round(elementBalance.earth * 10) / 10,
      metal: Math.round(elementBalance.metal * 10) / 10,
      water: Math.round(elementBalance.water * 10) / 10,
    },
    strength,
    favorableElements,
    unfavorableElements,
    favorableGods,
  }, null, 2);
}

/**
 * 生成完整报告的主Prompt
 */
export function generateFullReportPrompt(params: ReportPromptParams): string {
  const { baziResult, locale } = params;
  const context = generateBaziContext(baziResult, params.birthDate, params.birthTime);
  const element = baziResult.element;
  const polarity = baziResult.polarity;
  const data = elementData[element];
  const polarityLabel = polarity === 'yin' ? 'Yin' : 'Yang';
  const { tenGods } = baziResult;

  if (locale === 'zh') {
    return `你是一位精通八字命理的专家，将古老的中国玄学智慧翻译为现代心理学、自我提升和健康生活方式的语言。

## 用户完整命盘

${context}

## 用户的五行身份
用户是一位${polarityLabel === 'Yin' ? '阴' : '阳'}${element === 'wood' ? '木' : element === 'fire' ? '火' : element === 'earth' ? '土' : element === 'metal' ? '金' : '水'}命人 — ${params.baziResult.personalityArchetype}。
核心特质：${data.keywords.join('、')}。

---

## 任务要求

生成一份深度个性化的"能量蓝图报告"，包含恰好 7 个部分。每部分 180-250 字。用温暖、神秘但接地气的语气写作。使用现代心理学和自我帮助术语。**不要用英文术语如 "Bazi" 或 "Qi" —— 将概念翻译成中文友好的语言**。

### 语气指南：
- 神秘但务实、激励人心、赋予力量
- 使用建议性语言（"你可能会发现"、"考虑探索"、"你的能量倾向于"）
- 绝不提供医疗、财务或法律建议
- 绝不做出绝对预测（"你将会"、"你必须"）
- 基于用户实际的命盘数据提供具体可操作的洞察
- 引用他们的具体日主、十神、五行平衡和喜用神

### 1. 总览 — 你的能量印记
基于四柱描述用户的整体能量模式。引用他们的日主五行和阴阳属性。解释主导和缺失的元素对他们人生道路意味着什么。提及他们的身强身弱（${params.baziResult.strength === 'strong' ? '身强' : params.baziResult.strength === 'weak' ? '身弱' : '中和'}）如何塑造他们面对挑战的方式。

### 2. 人格解码
基于日主 + 十神配置深入剖析他们的性格。他们的${tenGods.monthGan}（月令影响）如何塑造内心驱动力？他们的${tenGods.yearGan}（年柱影响）透露出怎样的成长背景和先天特质？他们的喜用神（${params.baziResult.favorableElements.map(e => e === 'wood' ? '木' : e === 'fire' ? '火' : e === 'earth' ? '土' : e === 'metal' ? '金' : '水').join('、')}）如何在性格中体现？

### 3. 事业与使命
基于十神分析事业潜力。${params.baziResult.favorableGods.includes('正官') || params.baziResult.favorableGods.includes('七杀') ? '他们的官杀暗示着领导力潜质。' : ''}${params.baziResult.favorableGods.includes('偏财') || params.baziResult.favorableGods.includes('正财') ? '他们的财星暗示着商业头脑。' : ''}建议 2-3 个与其五行本性契合的职业方向。解释他们的${params.baziResult.strength === 'strong' ? '身强自信' : params.baziResult.strength === 'weak' ? '身弱协作' : '中和适应性'}如何影响他们的职业态度。

### 4. 感情与爱情
基于日主和五行平衡描述他们的感情风格。哪些五行（${params.baziResult.favorableElements.map(e => e === 'wood' ? '木' : e === 'fire' ? '火' : e === 'earth' ? '土' : e === 'metal' ? '金' : '水').join('、')}）自然与他们和谐共振？他们的${polarityLabel === 'Yin' ? '阴' : '阳'}属性在爱情中如何体现？根据主导十神提及他们的"爱的语言"。如果食伤旺，他们需要智性连接；如果财星旺，他们通过实际行动表达爱。

### 5. 健康与养生
聚焦与五行平衡对齐的整体养生（非医疗建议）。他们的${params.baziResult.elementBalance.wood < 1 ? '木弱' : ''}${params.baziResult.elementBalance.fire < 1 ? '火弱' : ''}${params.baziResult.elementBalance.earth < 1 ? '土弱' : ''}${params.baziResult.elementBalance.metal < 1 ? '金弱' : ''}${params.baziResult.elementBalance.water < 1 ? '水弱' : ''}暗示特定的养生需求。建议环境、食物（大类）、运动方式和正念练习来恢复能量。推荐如何日常激活喜用神。

### 6. 2026 年运势展望
基于用户五行和喜用神给出 2026 年的个性化能量展望。2026 是丙午年 —— 强火之年。解释这一年的火能量如何与他们${element === 'wood' ? '木' : element === 'fire' ? '火' : element === 'earth' ? '土' : element === 'metal' ? '金' : '水'}日主互动。突出成长机会和需要注意的领域。以赋予力量的前瞻性声明结尾。

### 7. 激活指南 — 你的日常修行
给出 3-5 个具体可执行的日常建议来激活喜用神（${params.baziResult.favorableElements.map(e => e === 'wood' ? '木' : e === 'fire' ? '火' : e === 'earth' ? '土' : e === 'metal' ? '金' : '水').join('、')}）。这些应该是可以轻松融入日常的小习惯。包括：晨间仪式、颜色/穿搭建议、空间/环境贴士、以及关系实践。

---

## 输出格式

只返回一个 JSON 对象，使用以下精确键名，不要 markdown 代码块：

{"overview":"...","personality":"...","career":"...","love":"...","health":"...","forecast":"...","advice":"..."}

每个值必须以以下内容结尾："此洞察仅供娱乐和自我反思之用。"`;
  }

  return `You are an expert in Bazi (Four Pillars of Destiny) who translates ancient Chinese metaphysics into modern Western self-help, psychology, and wellness language.

## User's Complete Birth Chart

${context}

## User's Elemental Identity
The user is a ${polarityLabel} ${element.toUpperCase()} person — ${params.baziResult.personalityArchetype}.
Core traits: ${data.keywords.join(', ')}.

---

## YOUR TASK

Generate a deeply personalized "Energy Blueprint Report" with EXACTLY 7 sections. Each section should be 180-250 words (not sentences — words). Write in a warm, mystical yet grounded tone. Use modern psychology and self-help terminology. NEVER use Chinese terms like "Bazi" or "Qi" — translate concepts into Western-friendly language.

### Tone Guidelines:
- Mystical but grounded, inspiring, and empowering
- Use suggestive language ("you may find", "consider exploring", "your energy tends toward")
- NEVER give medical, financial, or legal advice
- NEVER make absolute predictions ("you will", "you must")
- Include specific, actionable insights based on the user's actual birth chart data above
- Reference their specific Day Master, Ten Gods, element balance, and favorable elements

### 1. Overview — Your Energy Signature
Describe the user's overall energy pattern based on their Four Pillars. Reference their Day Master element and polarity. Explain what their dominant and missing elements mean for their life path. Mention how their strength level (${params.baziResult.strength}) shapes their approach to challenges.

### 2. Personality Decoding
Deep dive into their character based on Day Master + Ten Gods configuration. How does their ${tenGods.monthGan} (monthly influence) shape their inner drives? What does their ${tenGods.yearGan} (background influence) say about their upbringing and inherited traits? How do their favorable elements (${params.baziResult.favorableElements.join(', ')}) manifest in their personality?

### 3. Career & Purpose
Analyze career potential based on their Ten Gods. ${params.baziResult.favorableGods.includes('正官') || params.baziResult.favorableGods.includes('七杀') ? 'Their Authority/Challenge gods suggest leadership potential.' : ''} ${params.baziResult.favorableGods.includes('偏财') || params.baziResult.favorableGods.includes('正财') ? 'Their Wealth gods indicate business acumen.' : ''} Suggest 2-3 specific career directions that align with their elemental nature. Explain how their ${params.baziResult.strength === 'strong' ? 'strong self-assurance' : params.baziResult.strength === 'weak' ? 'collaborative nature' : 'adaptable energy'} influences their professional approach.

### 4. Relationships & Love
Describe their relationship style based on their Day Master and element balance. Which elements (${params.baziResult.favorableElements.join(', ')}) naturally harmonize with them? How does their ${polarityLabel} nature show up in love? Mention their "love language" based on their dominant Ten Gods. If they have strong Output gods (食神/伤官), they need intellectual connection. If strong Wealth gods, they express love through acts of service.

### 5. Health & Wellness
Focus on holistic wellness aligned to their element balance (NOT medical advice). Their ${params.baziResult.elementBalance.wood < 1 ? 'low Wood energy' : ''}${params.baziResult.elementBalance.fire < 1 ? 'low Fire energy' : ''}${params.baziResult.elementBalance.earth < 1 ? 'low Earth energy' : ''}${params.baziResult.elementBalance.metal < 1 ? 'low Metal energy' : ''}${params.baziResult.elementBalance.water < 1 ? 'low Water energy' : ''} suggests specific lifestyle needs. Suggest environments, foods (general categories), movement practices, and mindfulness techniques that restore their energy. Recommend how to activate their favorable elements daily.

### 6. 2026 Energy Forecast
Give a personalized energy forecast for 2026 based on their element and favorable elements. 2026 is a 丙午 (Bing Wu) year — strong Fire energy. Explain how this Fire year specifically interacts with their ${element} Day Master. Highlight opportunities for growth and areas to be mindful of. End with an empowering, forward-looking statement.

### 7. Activation Guide — Your Daily Practice
Give 3-5 concrete, daily actionable recommendations to activate their favorable elements (${params.baziResult.favorableElements.join(', ')}). These should be simple practices they can integrate into their routine. Include: a morning ritual, a color/wardrobe suggestion, a space/environment tip, and a relationship practice.

---

## OUTPUT FORMAT

Return ONLY a JSON object with these exact keys, no markdown code blocks:

{"overview":"...","personality":"...","career":"...","love":"...","health":"...","forecast":"...","advice":"..."}

Every value MUST end with: \" This insight is for entertainment and self-reflection purposes only.\"`;
}
