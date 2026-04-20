'use client';

import { useState, useCallback } from 'react';
import { AIReport, BaziResult } from '@/types';

interface UseLLMReturn {
  generateReport: (params: {
    baziResult: BaziResult;
    birthDate: string;
    birthTime: string;
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
        return getFallbackReport(params.baziResult);
      }

      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('LLM Error:', errorMessage);
      // Return fallback on any error
      return getFallbackReport(params.baziResult);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateReport, isLoading, error };
}

/**
 * 基于真实八字数据的降级报告
 * 当LLM不可用时，使用模板化但个性化的内容
 */
function getFallbackReport(bazi: BaziResult): AIReport {
  const { element, polarity, strength, favorableElements, unfavorableElements, personalityArchetype, tenGods, elementBalance, favorableGods } = bazi;
  const data = elementData[element];
  const p = polarity === 'yin' ? 'Yin' : 'Yang';
  const s = strength;
  
  // 根据十神和五行缺失生成个性化内容
  const hasLowElement = Object.entries(elementBalance).some(([_, v]) => v < 1);
  const lowElements = Object.entries(elementBalance)
    .filter(([_, v]) => v < 1)
    .map(([k, _]) => k);
  
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

// 需要导入elementData用于fallback
import { elementData } from '@/lib/elements';
