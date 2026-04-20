import { ElementType, Polarity, AIReport } from '@/types';
import { elementArchetypeNames } from './elements';

export interface ReportPromptParams {
  element: ElementType;
  polarity: Polarity;
  birthDate: string;
}

export function generateReportPrompt(params: ReportPromptParams): string {
  const archetype = elementArchetypeNames[params.element];
  const polarityLabel = params.polarity === 'yin' ? 'Yin' : 'Yang';
  
  return `You are an expert in Bazi (Four Pillars of Destiny) translated into modern Western self-help and wellness language.

The user is a ${polarityLabel} ${params.element} person (Elemental Archetype: ${archetype}).

Generate a personalized Energy Blueprint Report with EXACTLY 4 sections, each 2-3 sentences:

1. **Career & Purpose**
   - Describe their natural strengths and ideal work environment
   - Suggest career directions that align with their ${params.element} element energy
   - Mention how their ${polarityLabel} nature influences their professional approach

2. **Relationships & Love**
   - Describe their relationship style and emotional patterns
   - Mention which elements they naturally harmonize with or challenge
   - Give one specific insight about their love language

3. **Health & Wellness**
   - Focus on holistic wellness aligned to their element (not medical advice)
   - Suggest lifestyle practices, environments, or rhythms that restore their energy
   - Include a mindfulness or spiritual practice recommendation

4. **2026 Energy Forecast**
   - Give a general energy forecast for the upcoming year
   - Highlight opportunities for growth and areas to be mindful of
   - End with an empowering, forward-looking statement

**Critical Tone Guidelines:**
- Mystical but grounded, inspiring, and empowering
- Use modern self-help language; avoid Chinese terminology
- NEVER give medical, financial, or legal advice
- NEVER make absolute predictions ("you will", "you must")
- Use suggestive language ("you may find", "consider exploring", "your energy tends toward")
- End the ENTIRE response with: "This insight is for entertainment and self-reflection purposes only."

**Output Format - Return ONLY a JSON object, no markdown code blocks:**
{"career":"...","love":"...","health":"...","forecast":"..."}`;
}

export function getFallbackReport(element: ElementType, polarity: Polarity): AIReport {
  const p = polarity === 'yin' ? 'Yin' : 'Yang';
  
  const fallbacks: Record<ElementType, AIReport> = {
    wood: {
      career: `As ${p} Wood — The Growth Pioneer, you thrive in environments that value innovation and vision. Your natural ability to see future possibilities makes you excellent in strategic roles, creative industries, or entrepreneurial ventures. Consider careers where you can plant seeds and watch ideas grow over time.`,
      love: `In relationships, you bring nurturing energy and genuine care for your partner's growth. You harmonize beautifully with Fire and Water elements, while Metal may challenge you to find balance. Your love language involves acts of service and creating shared visions for the future.`,
      health: `Your Wood energy flourishes with outdoor activities, especially in forests or green spaces. Morning routines that include stretching or gentle movement help your energy flow smoothly. Consider practices like Tai Chi or forest bathing to maintain your vitality and inner balance.`,
      forecast: `2026 brings opportunities for significant personal and professional expansion. Your pioneering spirit will find fertile ground for new projects and relationships. Trust your vision and take calculated risks — the universe is aligning to support your growth this year. This insight is for entertainment and self-reflection purposes only.`,
    },
    fire: {
      career: `As ${p} Fire — The Radiant Inspirer, you shine brightest in roles that allow self-expression and connection with others. Your natural charisma draws people to your ideas, making you effective in leadership, teaching, performance, or marketing. You need work that fuels your passion rather than draining it.`,
      love: `Your warmth and enthusiasm make you a magnetic partner who brings excitement to relationships. You connect most deeply with Wood and Earth elements, while Water may temper your flame in healthy ways. Your love language is quality time and words of affirmation that celebrate mutual growth.`,
      health: `Your Fire energy needs regular outlets for expression to avoid burnout. Dancing, cardio exercises, or any rhythmic movement helps channel your abundant energy. Evening wind-down rituals are essential — try candlelight meditation or journaling to cool your inner flame before sleep.`,
      forecast: `2026 invites you to illuminate new paths and inspire others through your authentic presence. Transformation is your theme this year — old structures may dissolve to make way for brighter possibilities. Embrace change as fuel for your evolution. This insight is for entertainment and self-reflection purposes only.`,
    },
    earth: {
      career: `As ${p} Earth — The Grounded Guardian, you excel in roles that require reliability, patience, and nurturing others. Your methodical approach ensures nothing falls through the cracks, making you invaluable in healthcare, education, project management, or counseling. Others naturally trust your steady presence.`,
      love: `You offer relationships a deep sense of security and unwavering support. You naturally harmonize with Metal and Fire, while Wood may stretch you to grow beyond your comfort zone. Your love language manifests through physical touch and creating comfortable, welcoming spaces for loved ones.`,
      health: `Your Earth energy is restored through connection with nature, especially mountains and gardens. Regular grounding practices like walking barefoot on grass or working with clay help center your energy. Consistent meal times and nourishing foods are particularly important for maintaining your stability.`,
      forecast: `2026 asks you to build lasting foundations while remaining open to necessary changes. Your natural patience will be rewarded as long-term plans begin to materialize. Trust the process — your steady presence creates ripples of positive influence. This insight is for entertainment and self-reflection purposes only.`,
    },
    metal: {
      career: `As ${p} Metal — The Strategic Architect, you bring precision and clarity to complex problems. Your analytical mind thrives in finance, law, engineering, research, or any field requiring systematic thinking. You have a gift for creating elegant structures from chaos, refining processes until they shine.`,
      love: `You approach relationships with loyalty and high standards, valuing honesty above all. You complement Water and Earth beautifully, while Fire may challenge you to embrace spontaneity. Your love language involves acts of service and creating thoughtful systems that show you care.`,
      health: `Your Metal energy benefits from practices that promote deep breathing and mental clarity. Activities like swimming, hiking at high altitudes, or practicing breathwork help purify and strengthen your inner resolve. Autumn is your power season — use it to release what no longer serves you.`,
      forecast: `2026 presents opportunities to cut through confusion and establish clear boundaries. Your discernment will serve you well as you make important decisions about your path forward. Trust your inner compass — it has been refined through years of experience. This insight is for entertainment and self-reflection purposes only.`,
    },
    water: {
      career: `As ${p} Water — The Intuitive Explorer, you navigate professional landscapes with remarkable adaptability and insight. Your intuitive intelligence serves you well in creative fields, psychology, research, or roles requiring diplomacy. You see connections others miss, flowing around obstacles rather than confronting them directly.`,
      love: `You bring emotional depth and intuitive understanding to relationships, often sensing your partner's needs before they articulate them. You flow naturally with Metal and Wood, while Earth provides grounding for your fluid nature. Your love language is quality time and deep, meaningful conversations.`,
      health: `Your Water energy is restored through proximity to oceans, rivers, or lakes. Fluid movement practices like swimming, yoga, or dance help maintain your natural flow. Regular journaling or dream work can help you process the deep emotional currents that run through your being.`,
      forecast: `2026 invites you to explore new depths and trust your intuition as never before. Like a river finding its path to the ocean, circumstances will guide you toward meaningful destinations. Embrace the unknown — your adaptability is your greatest strength. This insight is for entertainment and self-reflection purposes only.`,
    },
  };
  
  return fallbacks[element];
}
