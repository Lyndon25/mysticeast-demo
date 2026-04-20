'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, ChevronDown, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { castLine, generateDivination, LineType, Hexagram } from '@/lib/yijing';
import ParticleBackground from '@/components/ParticleBackground';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';

const lineSymbols: Record<LineType, string> = {
  'young-yang': '━━━',
  'young-yin': '━ ━',
  'old-yang': '━━━ ○',
  'old-yin': '━ ━ ×',
};

export default function DivinationPage() {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'question' | 'casting' | 'result'>('intro');
  const [question, setQuestion] = useState('');
  const [castLines, setCastLines] = useState<{ type: LineType; value: number; changing: boolean }[]>([]);
  const [currentCast, setCurrentCast] = useState(0);
  const [result, setResult] = useState<{
    mainHexagram: Hexagram;
    changedHexagram: Hexagram;
    changingLines: number[];
    lineTexts: string[];
  } | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);

  const getFallbackInterpret = useCallback((res: NonNullable<typeof result>) => {
    return `**The Current Situation**

You have drawn ${res.mainHexagram.nameEn} — a powerful symbol of ${res.mainHexagram.judgment.toLowerCase().split('.')[0]}. This suggests you are in a phase where ${res.mainHexagram.image.toLowerCase().split('.')[0]}.

**The Guidance**

${res.changingLines.length > 0 ? `The changing line${res.changingLines.length > 1 ? 's' : ''} speak${res.changingLines.length > 1 ? '' : 's'} to a specific moment of transformation. ${res.lineTexts[0]}` : 'With no changing lines, this reading speaks to a stable situation — the message is clear and unwavering.'}

**Actionable Steps**

1. Take a quiet moment to reflect on what ${res.mainHexagram.nameEn} means for your current path.
2. Consider how the wisdom of "${res.mainHexagram.judgment}" applies to your question.
3. Trust that the answer will unfold in its own time — the I Ching rarely gives instant clarity, but always gives truth.

This insight is for entertainment and self-reflection purposes only.`;
  }, []);

  const handleInterpret = useCallback(async (res: typeof result) => {
    if (!res) return;
    setIsInterpreting(true);
    try {
      const response = await fetch('/api/divination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          mainHexagram: res.mainHexagram,
          changedHexagram: res.changedHexagram,
          changingLines: res.changingLines,
          lineTexts: res.lineTexts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInterpretation(data.interpretation || getFallbackInterpret(res));
      } else {
        setInterpretation(getFallbackInterpret(res));
      }
    } catch {
      setInterpretation(getFallbackInterpret(res));
    } finally {
      setIsInterpreting(false);
    }
  }, [question, getFallbackInterpret]);

  // 自动投掷动画
  useEffect(() => {
    if (step === 'casting' && currentCast < 6) {
      const timer = setTimeout(() => {
        const line = castLine();
        setCastLines(prev => [...prev, line]);
        setCurrentCast(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (step === 'casting' && currentCast === 6 && castLines.length === 6) {
      const res = generateDivination();
      setResult(res);
      setStep('result');
      // 自动触发AI解卦
      handleInterpret(res);
    }
  }, [step, currentCast, castLines.length, handleInterpret]);

  const handleStart = () => setStep('question');
  const handleCast = () => {
    setCastLines([]);
    setCurrentCast(0);
    setResult(null);
    setInterpretation('');
    setStep('casting');
  };
  const handleReset = () => {
    setStep('intro');
    setQuestion('');
    setCastLines([]);
    setCurrentCast(0);
    setResult(null);
    setInterpretation('');
  };

  return (
    <main className="relative min-h-screen py-20 px-6">
      <ParticleBackground />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.push('/')}
        className="fixed top-4 left-4 z-50 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        ← Back to Home
      </motion.button>

      <div className="relative z-10 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Intro */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                I Ching Divination
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Ask the Oracle</h1>
              <p className="text-slate-400 max-w-lg mx-auto mb-8">
                The I Ching has guided seekers for 3,000 years. Cast the virtual coins and receive wisdom tailored to your question.
              </p>
              <MysticButton onClick={handleStart} size="lg">
                Begin the Reading
                <ChevronDown className="w-5 h-5 ml-2" />
              </MysticButton>
            </motion.div>
          )}

          {/* Question */}
          {step === 'question' && (
            <motion.div key="question" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h2 className="text-2xl font-serif text-white mb-6">What weighs on your heart?</h2>
              <p className="text-slate-400 mb-6">Enter your question, or leave it blank for general guidance.</p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Should I make this career change?"
                className="w-full max-w-lg mx-auto bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors mb-6 h-32 resize-none"
              />
              <MysticButton onClick={handleCast} size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Cast the Coins
              </MysticButton>
            </motion.div>
          )}

          {/* Casting Animation */}
          {step === 'casting' && (
            <motion.div key="casting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-20 h-20 mx-auto mb-8 border-2 border-amber-500/30 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl">☯</span>
              </motion.div>
              <p className="text-amber-400 text-lg mb-4">Casting the ancient coins...</p>
              <p className="text-slate-500 text-sm">{currentCast} of 6 lines revealed</p>

              <div className="mt-8 space-y-2">
                {castLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-2xl font-mono ${line.changing ? 'text-amber-400' : 'text-slate-300'}`}
                  >
                    {lineSymbols[line.type]}
                  </motion.div>
                ))}
                {Array.from({ length: 6 - castLines.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="text-2xl font-mono text-slate-700">···</div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result */}
          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Hexagram Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-sm mb-4">
                  <Heart className="w-4 h-4" />
                  Your Oracle Reading
                </div>
                <h2 className="text-3xl font-serif text-white mb-2">
                  {result.mainHexagram.nameEn}
                </h2>
                <p className="text-amber-400 text-lg">{result.mainHexagram.symbol} {result.mainHexagram.number}. {result.mainHexagram.name}</p>
              </div>

              {/* Hexagram Lines */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="space-y-2 text-center">
                  {[...castLines].reverse().map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`text-xl font-mono ${line.changing ? 'text-amber-400' : 'text-slate-300'}`}
                    >
                      {lineSymbols[line.type]}
                    </motion.div>
                  ))}
                </div>

                {result.changingLines.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                    <p className="text-amber-400 text-sm">Changing Lines: {result.changingLines.join(', ')}</p>
                    {result.changedHexagram.number !== result.mainHexagram.number && (
                      <p className="text-slate-400 text-sm mt-1">
                        Changes to: {result.changedHexagram.nameEn} ({result.changedHexagram.symbol})
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Core Wisdom */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-serif text-white mb-3">The Judgment</h3>
                <p className="text-slate-300 leading-relaxed">{result.mainHexagram.judgment}</p>
                <h3 className="text-lg font-serif text-white mt-4 mb-3">The Image</h3>
                <p className="text-slate-300 leading-relaxed">{result.mainHexagram.image}</p>
              </div>

              {/* AI Interpretation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-serif text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Personalized Guidance
                </h3>
                {isInterpreting ? (
                  <div className="flex items-center gap-3 text-slate-400">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full" />
                    The oracle is contemplating...
                  </div>
                ) : (
                  <div className="prose prose-invert prose-slate max-w-none">
                    <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {interpretation}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MysticButton onClick={handleReset} size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Cast Again
                </MysticButton>
              </div>

              <div className="flex justify-center">
                <DisclaimerBanner />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
