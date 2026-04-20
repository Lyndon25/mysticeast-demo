'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Scroll } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ElementResult, BaziResult, ElementType } from '@/types';
import { calculateBazi, formatBazi, getStrengthDescription } from '@/lib/bazi';
import ParticleBackground from '@/components/ParticleBackground';
import ElementCard from '@/components/ElementCard';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function ResultPage() {
  const router = useRouter();
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [elementResult, setElementResult] = useState<ElementResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mysticeast-birth-info');
    if (!stored) {
      router.push('/quiz');
      return;
    }

    const info = JSON.parse(stored);

    // 使用新的真实八字引擎计算
    const calculatedBazi = calculateBazi(info.date, info.time);
    setBaziResult(calculatedBazi);

    // 兼容旧版 ElementResult
    const legacyResult: ElementResult = {
      element: calculatedBazi.element,
      polarity: calculatedBazi.polarity,
      archetype: calculatedBazi.archetype,
      keywords: calculatedBazi.keywords,
      color: calculatedBazi.color,
      description: calculatedBazi.description,
    };
    setElementResult(legacyResult);

    // 存储结果供报告页使用
    localStorage.setItem('mysticeast-bazi-result', JSON.stringify(calculatedBazi));
    localStorage.setItem('mysticeast-element-result', JSON.stringify(legacyResult));
  }, [router]);

  if (!baziResult || !elementResult) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Calculating your ancient blueprint...</div>
      </main>
    );
  }

  const { fourPillars, dayMaster, tenGods, elementBalance, strength, favorableElements, personalityArchetype } = baziResult;

  // 五行颜色映射
  const elementColorMap: Record<ElementType, string> = {
    wood: '#22c55e',
    fire: '#ef4444',
    earth: '#d97706',
    metal: '#a8a29e',
    water: '#3b82f6',
  };

  return (
    <main className="relative min-h-screen py-20 px-6">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Your Energy Blueprint — Revealed
          </div>
        </motion.div>

        {/* Element Card (兼容旧版) */}
        <ElementCard result={elementResult} />

        {/* 四柱排盘展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Scroll className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-serif text-white">Your Four Pillars</h3>
            <span className="text-slate-500 text-sm ml-auto font-mono">{formatBazi(baziResult)}</span>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {(['year', 'month', 'day', 'hour'] as const).map((pos, idx) => {
              const pillar = fourPillars[pos];
              const tenGod = pos === 'year' ? tenGods.yearGan : pos === 'month' ? tenGods.monthGan : pos === 'hour' ? tenGods.hourGan : null;
              const isDayMaster = pos === 'day';
              
              return (
                <motion.div
                  key={pos}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className={`text-center p-3 md:p-4 rounded-xl border ${
                    isDayMaster 
                      ? 'border-cyan-500/40 bg-cyan-500/10' 
                      : 'border-slate-700/50 bg-slate-800/30'
                  }`}
                >
                  <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">{pos}</div>
                  <div 
                    className="text-2xl md:text-3xl font-bold mb-1"
                    style={{ color: elementColorMap[pillar.gan.element] }}
                  >
                    {pillar.gan.gan}
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    {pillar.gan.element} · {pillar.gan.polarity}
                  </div>
                  <div 
                    className="text-xl md:text-2xl font-bold mb-1"
                    style={{ color: elementColorMap[pillar.zhi.element] }}
                  >
                    {pillar.zhi.zhi}
                  </div>
                  <div className="text-xs text-slate-400">
                    {pillar.zhi.element}
                  </div>
                  {tenGod && (
                    <div className="mt-2 text-[10px] md:text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 inline-block">
                      {tenGod}
                    </div>
                  )}
                  {isDayMaster && (
                    <div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 inline-block">
                      Day Master
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 五行能量条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-lg font-serif text-white mb-4">Elemental Balance</h3>
          <div className="space-y-3">
            {(['wood', 'fire', 'earth', 'metal', 'water'] as ElementType[]).map((el) => {
              const value = elementBalance[el];
              const maxValue = Math.max(...Object.values(elementBalance));
              const percentage = (value / (maxValue * 1.5)) * 100;
              const isFavorable = favorableElements.includes(el);
              
              return (
                <div key={el} className="flex items-center gap-3">
                  <span className="w-16 text-sm text-slate-400 capitalize">{el}</span>
                  <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: elementColorMap[el] }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm text-slate-400">{Math.round(value * 10) / 10}</span>
                  {isFavorable && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">★</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400/50" />
              ★ Favorable Element
            </span>
            <span>Strength: <span className="text-cyan-400 capitalize">{strength}</span></span>
          </div>
        </motion.div>

        {/* 日主说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 max-w-xl mx-auto text-center"
        >
          <p className="text-slate-300 text-base leading-relaxed">
            {getStrengthDescription(strength)}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-10 text-center"
        >
          <div className="mb-4">
            <p className="text-slate-400 text-sm mb-2">
              Your Day Master is <span className="text-cyan-400">{dayMaster.gan}{dayMaster.element === 'wood' ? '木' : dayMaster.element === 'fire' ? '火' : dayMaster.element === 'earth' ? '土' : dayMaster.element === 'metal' ? '金' : '水'}</span> — {personalityArchetype}
            </p>
            <p className="text-slate-500 text-xs">
              Favorable Elements: {favorableElements.map(e => (
                <span key={e} className="text-cyan-400 capitalize">{e} </span>
              ))}
            </p>
          </div>
          <MysticButton onClick={() => router.push('/report')} size="lg">
            Unlock Full Energy Blueprint
            <ArrowRight className="w-5 h-5 ml-2" />
          </MysticButton>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex justify-center"
        >
          <DisclaimerBanner />
        </motion.div>
      </div>
    </main>
  );
}
