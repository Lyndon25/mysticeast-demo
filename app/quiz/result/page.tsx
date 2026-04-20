'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ElementResult } from '@/types';
import { calculateElement, getPolarityDescription } from '@/lib/bazi-simple';
import ParticleBackground from '@/components/ParticleBackground';
import ElementCard from '@/components/ElementCard';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ElementResult | null>(null);

  useEffect(() => {
    // Get birth info from localStorage
    const stored = localStorage.getItem('mysticeast-birth-info');
    if (!stored) {
      router.push('/quiz');
      return;
    }

    const info = JSON.parse(stored);

    // Calculate element
    const calculatedResult = calculateElement(info.date);
    setResult(calculatedResult);

    // Store result for report page
    localStorage.setItem('mysticeast-element-result', JSON.stringify(calculatedResult));
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Calculating...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen py-20 px-6">
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Your Elemental Archetype
          </div>
        </motion.div>

        {/* Element Card */}
        <ElementCard result={result} />

        {/* Polarity Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 max-w-xl mx-auto text-center"
        >
          <p className="text-slate-300 text-base leading-relaxed">
            {getPolarityDescription(result.polarity)}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 text-center"
        >
          <div className="mb-4">
            <p className="text-slate-400 text-sm mb-2">
              Want to dive deeper into your destiny?
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
          transition={{ delay: 1.1 }}
          className="mt-8 flex justify-center"
        >
          <DisclaimerBanner />
        </motion.div>
      </div>
    </main>
  );
}
