'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Sparkles, Wand2, ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BaziResult, AIReport, ReportChapterKey } from '@/types';
import { useLLM } from '@/hooks/useLLM';
import { t, TranslationKey } from '@/lib/i18n';
import ParticleBackground from '@/components/ParticleBackground';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const chapterKeys: ReportChapterKey[] = [
  'chapter1', 'chapter2', 'chapter3', 'chapter4',
  'chapter5', 'chapter6', 'chapter7', 'chapter8',
];

const chapterIcons = [
  '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌',
];

export default function ReportPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [showNav, setShowNav] = useState(false);

  const { generateReport } = useLLM();

  // IntersectionObserver to track active chapter
  useEffect(() => {
    if (!report) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = chapterKeys.findIndex((k) => k === entry.target.id);
            if (idx !== -1) setActiveChapter(idx);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    chapterKeys.forEach((key) => {
      const el = document.getElementById(key);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [report]);

  useEffect(() => {
    const storedBazi = localStorage.getItem('mysticeast-bazi-result');
    const storedElement = localStorage.getItem('mysticeast-element-result');

    if (!storedBazi && !storedElement) {
      router.push('/quiz');
      return;
    }

    if (storedBazi) {
      setBaziResult(JSON.parse(storedBazi));
    }

    const storedReport = localStorage.getItem('mysticeast-report');
    if (storedReport) {
      try {
        const parsed = JSON.parse(storedReport);
        // Validate it's a V2 report
        if (parsed.chapter1) {
          setReport(parsed);
        } else {
          // Old V1 report, discard
          localStorage.removeItem('mysticeast-report');
        }
      } catch {
        localStorage.removeItem('mysticeast-report');
      }
    }
  }, [router]);

  // Show nav after scrolling past header
  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerateReport = async () => {
    if (!baziResult) return;

    setIsGenerating(true);
    try {
      const birthInfo = JSON.parse(localStorage.getItem('mysticeast-birth-info') || '{}');

      const generatedReport = await generateReport({
        baziResult,
        birthDate: birthInfo.date || '',
        birthTime: birthInfo.time || '',
        locale,
      });

      setReport(generatedReport);
      localStorage.setItem('mysticeast-report', JSON.stringify(generatedReport));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToChapter = useCallback((idx: number) => {
    const el = document.getElementById(chapterKeys[idx]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (!baziResult) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">{t('report.loading', locale)}</div>
      </main>
    );
  }

  const data = {
    color: baziResult.color,
    name: baziResult.element.charAt(0).toUpperCase() + baziResult.element.slice(1),
  };

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
        {t('nav.backToResult', locale)}
      </motion.button>

      <LanguageSwitcher className="fixed top-4 right-4 z-50" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            {t('report.badge', locale)}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            {baziResult.personalityArchetype}
          </h1>
          <p className="text-slate-400 mt-2">
            {t(`polarity.${baziResult.polarity}` as TranslationKey, locale)} {t(`element.${baziResult.element}` as TranslationKey, locale)} · {t('report.dayMasterLabel', locale)}: {baziResult.dayMaster.gan}
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
                {t('report.locked.title', locale)}
              </h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">
                {t('report.locked.subtitle', locale)}
              </p>

              {/* 免费预览内容 */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 max-w-lg mx-auto mb-8 text-left">
                <h4 className="text-sm font-medium text-cyan-400 mb-3">{t('report.locked.preview', locale)}</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>{t('report.locked.element', locale)}</span>
                    <span className="text-white">{t(`element.${baziResult.element}` as TranslationKey, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('report.locked.polarity', locale)}</span>
                    <span className="text-white">{t(`polarity.${baziResult.polarity}` as TranslationKey, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('report.locked.strength', locale)}</span>
                    <span className="text-white">{t(`result.strength.${baziResult.strength}` as TranslationKey, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('report.locked.favorable', locale)}</span>
                    <span className="text-cyan-400">{baziResult.favorableElements.map(e => t(`element.${e}` as TranslationKey, locale)).join(', ')}</span>
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
                  {t('report.locked.aiStatus', locale)}
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
                    {t('report.locked.generating', locale)}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('report.locked.generate', locale)}
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
              className="relative"
            >
              {/* Chapter Navigation — Desktop (fixed right) */}
              <nav
                className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1.5 transition-opacity duration-300 ${showNav ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {chapterKeys.map((key, idx) => (
                  <button
                    key={key}
                    onClick={() => scrollToChapter(idx)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left w-48 ${
                      activeChapter === idx
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-serif shrink-0 ${
                      activeChapter === idx ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {chapterIcons[idx]}
                    </span>
                    <span className="truncate">{t(`report.${key}.title` as TranslationKey, locale)}</span>
                    {activeChapter === idx && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
                  </button>
                ))}
              </nav>

              {/* Chapter Navigation — Mobile (horizontal scroll top) */}
              <div className="lg:hidden mb-6 overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {chapterKeys.map((key, idx) => (
                    <button
                      key={key}
                      onClick={() => scrollToChapter(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                        activeChapter === idx
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-500 hover:text-slate-300 border border-slate-800'
                      }`}
                    >
                      {chapterIcons[idx]} {t(`report.${key}.title` as TranslationKey, locale)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Report Chapters */}
              <div className="space-y-16 max-w-3xl">
                {chapterKeys.map((key, idx) => (
                  <motion.section
                    key={key}
                    id={key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="scroll-mt-24"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-serif text-xl"
                        style={{
                          backgroundColor: `${data.color}12`,
                          color: data.color,
                          border: `1px solid ${data.color}25`,
                        }}
                      >
                        {chapterIcons[idx]}
                      </div>
                      <div className="pt-1">
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                          Chapter {idx + 1}
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif text-white">
                          {t(`report.${key}.title` as TranslationKey, locale)}
                        </h2>
                      </div>
                    </div>

                    {/* Chapter Content */}
                    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 md:p-8">
                      <MarkdownRenderer
                        content={String(report[key] || '')}
                        className="prose-headings:text-white prose-h2:text-lg prose-h2:font-serif"
                      />
                    </div>
                  </motion.section>
                ))}
              </div>

              {/* Regenerate button */}
              <div className="text-center mt-16 mb-8">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="text-slate-500 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? t('report.locked.generating', locale) : t('report.locked.generate', locale)}
                </button>
                <p className="text-slate-600 text-xs mt-3">
                  {locale === 'zh'
                    ? '每份报告基于你的四柱八字实时生成，每次结果可能略有不同。'
                    : 'Each report is generated in real-time based on your Four Pillars; results may vary slightly.'}
                </p>
              </div>

              {/* PDF teaser (Phase 2 placeholder) */}
              <div className="max-w-lg mx-auto text-center mb-12">
                <div className="bg-gradient-to-r from-slate-900/60 to-slate-900/40 border border-slate-800 rounded-xl p-6">
                  <BookOpen className="w-6 h-6 text-slate-500 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    {locale === 'zh' ? '更详细的 PDF 报告' : 'More Detailed PDF Report'}
                  </h4>
                  <p className="text-slate-500 text-xs mb-4">
                    {locale === 'zh'
                      ? '生成更详细的 PDF 报告，需要三到五分钟。八章内容将详实至三倍，并包含东方禅意视觉层。'
                      : 'Generate a more detailed PDF report, taking three to five minutes. Eight chapters expanded threefold with Eastern Zen visual layer.'}
                  </p>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-slate-500 text-xs">
                    {locale === 'zh' ? '即将推出' : 'Coming Soon'}
                  </span>
                </div>
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
