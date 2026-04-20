'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Heart, Leaf, Calendar, Sparkles, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ElementResult, AIReport, LLMConfig } from '@/types';
import { elementData } from '@/lib/elements';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLLM } from '@/hooks/useLLM';
import ParticleBackground from '@/components/ParticleBackground';
import ElementCard from '@/components/ElementCard';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';

const sections = [
  { id: 'career', label: 'Career & Purpose', icon: Briefcase },
  { id: 'love', label: 'Relationships & Love', icon: Heart },
  { id: 'health', label: 'Health & Wellness', icon: Leaf },
  { id: 'forecast', label: '2026 Forecast', icon: Calendar },
];

export default function ReportPage() {
  const router = useRouter();
  const [result, setResult] = useState<ElementResult | null>(null);
  const [activeTab, setActiveTab] = useState('career');
  const [report, setReport] = useState<AIReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [llmConfig] = useLocalStorage<LLMConfig>('mysticeast-llm-config', {
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  });

  const { generateReport } = useLLM({ config: llmConfig });

  useEffect(() => {
    const storedResult = localStorage.getItem('mysticeast-element-result');
    if (!storedResult) {
      router.push('/quiz');
      return;
    }

    const parsed = JSON.parse(storedResult);
    setResult(parsed);

    // Check if report already exists
    const storedReport = localStorage.getItem('mysticeast-report');
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    }
  }, [router]);

  const handleGenerateReport = async () => {
    if (!result) return;

    setIsGenerating(true);
    try {
      const generatedReport = await generateReport({
        element: result.element,
        polarity: result.polarity,
        birthDate: localStorage.getItem('mysticeast-birth-info') || '{}',
      });

      setReport(generatedReport);
      localStorage.setItem('mysticeast-report', JSON.stringify(generatedReport));
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Loading...</div>
      </main>
    );
  }

  const data = elementData[result.element];

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
            Personalized Insights
          </h1>
        </motion.div>

        {/* Element Identity Card (compact) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <ElementCard result={result} showFullDescription={false} />
        </motion.div>

        {/* Report Content */}
        <AnimatePresence mode="wait">
          {!report ? (
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
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Generate a personalized AI report covering your career, relationships, 
                health, and 2026 forecast based on your elemental archetype.
              </p>

              {/* API Key Status */}
              <div className="mb-6">
                {llmConfig.apiKey ? (
                  <p className="text-green-400 text-sm flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    AI reports enabled with your API key
                  </p>
                ) : (
                  <p className="text-amber-400 text-sm flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Using demo mode (pre-written reports)
                  </p>
                )}
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
                    Generate My Report
                  </>
                )}
              </MysticButton>
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
                      const Icon = sections.find(s => s.id === activeTab)?.icon || Briefcase;
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

                  <p className="text-slate-300 leading-relaxed text-base">
                    {report[activeTab as keyof AIReport]}
                  </p>
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
