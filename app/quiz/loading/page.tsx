'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { t } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoadingPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    t('loading.messages.0', locale),
    t('loading.messages.1', locale),
    t('loading.messages.2', locale),
    t('loading.messages.3', locale),
    t('loading.messages.4', locale),
  ];

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 500);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Navigate to result after 2.5 seconds
    const timeout = setTimeout(() => {
      router.push('/quiz/result');
    }, 2500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [router, loadingMessages.length]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute w-[400px] h-[400px] bg-cyan-900/10 blur-[120px] rounded-full top-1/3 left-1/2 -translate-x-1/2" />
      </div>

      <LanguageSwitcher className="fixed top-4 right-4 z-50" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        {/* Rotating symbol */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="w-24 h-24 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
          <div className="absolute inset-4 rounded-full border border-amber-500/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-cyan-400 font-serif">
            ☯
          </div>
        </motion.div>

        {/* Loading text */}
        <div className="h-12 mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-cyan-400 text-lg"
            >
              {loadingMessages[currentMessage]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-slate-500 text-sm mt-4">
          {t('loading.subtext', locale)}
        </p>
      </motion.div>
    </main>
  );
}
