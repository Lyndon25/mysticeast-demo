'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { getOtherLocale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'icon' | 'text' | 'both';
}

export default function LanguageSwitcher({ className = '', variant = 'both' }: LanguageSwitcherProps) {
  const { locale, toggleLocale } = useLanguage();
  const otherLocale = getOtherLocale(locale);

  const label = otherLocale === 'zh' ? '中文' : 'EN';

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      onClick={toggleLocale}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-sm cursor-pointer ${className}`}
      title={otherLocale === 'zh' ? 'Switch to Chinese' : 'Switch to English'}
    >
      {(variant === 'icon' || variant === 'both') && (
        <Globe className="w-3.5 h-3.5" />
      )}
      {(variant === 'text' || variant === 'both') && (
        <span className="font-medium">{label}</span>
      )}
    </motion.button>
  );
}
