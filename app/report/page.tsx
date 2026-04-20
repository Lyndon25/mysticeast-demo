'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Heart, Leaf, Calendar, Sparkles, Wand2,
  User, Brain, Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BaziResult, AIReport } from '@/types';
import { useLLM } from '@/hooks/useLLM';
import ParticleBackground from '@/components/ParticleBackground';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';

const sections = [
  { id: 'overview' as const, label: 'Overview', icon: User },
  { id: 'personality' as const, label: 'Personality', icon: Brain },
  { id: 'career' as const, label: 'Career & Purpose', icon: Briefcase },
  { id: 'love' as const, label: 'Relationships & Love', icon: Heart },
  { id: 'health' as const, label: 'Health & Wellness', icon: Leaf },
  { id: 'forecast' as const, label: '2026 Forecast', icon: Calendar },
  { id: 'advice' as const, label: 'Daily Practice', icon: Lightbulb },
];

export default function ReportPage() {
  const router = useRouter();
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [report, setReport] = useState<AIReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { generateReport } = useLLM();

  useEffect(() => {
    // 优先读取新的八字结果
    const storedBazi = localStorage.getItem('mysticeast-bazi-result');
    const storedElement = localStorage.getItem('mysticeast-element-result');
    
    if (!storedBazi && !storedElement) {
      router.push('/quiz');
      return;
    }

    if (storedBazi) {
      setBaziResult(JSON.parse(storedBazi));
    }

    // Check if report already exists
    const storedReport = localStorage.getItem('mysticeast-report');
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    }
  }, [router]);

  const handleGenerateReport = async () => {
    if (!baziResult) return;

    setIsGenerating(true);
    try {
      const birthInfo = JSON.parse(localStorage.getItem('mysticeast-birth-info') || '{}');
      
      const generatedReport = await generateReport({
        baziResult,
        birthDate: birthInfo.date || '',
        birthTime: birthInfo.time || '',
      });

      setReport(generatedReport);
      localStorage.setItem('mysticeast-report', JSON.stringify(generatedReport));
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!baziResult) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading your blueprint...</div>
      </main>
    );
  }

  const data = {
    color: baziResult.color,
    name: baziResult.element.charAt(0).toUpperCase() + baziResult.element.slice(1),
  };

  // 免费版限制：未生成报告时显示预览
  const isLocked = !report;

  return (
    <main className="relative min-h-screen py-20 px-6">
      <ParticleBackground />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.push('/quiz/result')}
        className="fixed top-4 left-4 z-50 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        ← Back to Result
      </motion.button>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Your Energy Blueprint
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            {baziResult.personalityArchetype}
          </h1>
          <p className="text-slate-400 mt-2">
            {baziResult.polarity === 'yin' ? 'Yin' : 'Yang'} {data.name} · Day Master: {baziResult.dayMaster.gan}
          </p>
        </motion.div>

        {/* Report Content */}
        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundColor: `${data.color}15`,
                  border: `2px solid ${data.color}40`,
                }}
              >
                <Wand2 className="w-8 h-8" style={{ color: data.color }} />
              </div>
              <h3 className="text-xl font-serif text-white mb-3">
                Unlock Your Full Report
              </h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">
                Generate a personalized 7-section AI report based on your complete Four Pillars birth chart.
              </p>

              {/* 免费预览内容 */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 max-w-lg mx-auto mb-8 text-left">
                <h4 className="text-sm font-medium text-cyan-400 mb-3">Free Preview</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Element</span>
                    <span className="text-white capitalize">{baziResult.element}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Polarity</span>
                    <span className="text-white capitalize">{baziResult.polarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strength</span>
                    <span className="text-white capitalize">{baziResult.strength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorable</span>
                    <span className="text-cyan-400">{baziResult.favorableElements.join(', ')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {baziResult.description}
                  </p>
                </div>
              </div>

              {/* API Status */}
              <div className="mb-6">
                <p className="text-cyan-400 text-sm flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  AI-Powered Full Report
                </p>
              </div>

              <MysticButton
                onClick={handleGenerateReport}
                disabled={isGenerating}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full mr-2"
                    />
                    Generating Your Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Full Report
                  </>
                )}
              </MysticButton>

              <p className="text-slate-600 text-xs mt-4">
                No API key? We&apos;ll generate a personalized report using your birth chart data.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all ${
                      activeTab === section.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white border border-transparent hover:border-slate-700'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10"
                >
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const Icon = sections.find(s => s.id === activeTab)?.icon || User;
                      return (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${data.color}15`,
                            color: data.color,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                      );
                    })()}
                    <h3 className="text-xl font-serif text-white">
                      {sections.find(s => s.id === activeTab)?.label}
                    </h3>
                  </div>

                  <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line">
                      {report?.[activeTab as keyof AIReport]}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Regenerate button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="text-slate-500 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? 'Regenerating...' : 'Regenerate Report'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="mt-10 flex justify-center">
          <DisclaimerBanner />
        </div>
      </div>
    </main>
  );
}
