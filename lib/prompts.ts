import { BaziResult } from '@/types';
import { elementData } from './elements';

// ==================== 报告生成 Prompt ====================

export interface ReportPromptParams {
  baziResult: BaziResult;
  birthDate: string;
  birthTime: string;
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
  const { baziResult } = params;
  const context = generateBaziContext(baziResult, params.birthDate, params.birthTime);
  const element = baziResult.element;
  const polarity = baziResult.polarity;
  const data = elementData[element];
  const polarityLabel = polarity === 'yin' ? 'Yin' : 'Yang';
  const { tenGods } = baziResult;
  
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
