'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Locale, getOtherLocale } from '@/lib/i18n';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface LanguageContextType {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [storedLocale, setStoredLocale] = useLocalStorage<Locale>('mysticeast-locale', 'en');
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  // 避免服务端渲染不匹配
  useEffect(() => {
    setLocaleState(storedLocale);
    setIsHydrated(true);
  }, [storedLocale]);

  const toggleLocale = useCallback(() => {
    const newLocale = getOtherLocale(locale);
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, [locale, setStoredLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, [setStoredLocale]);

  // 服务端渲染或水合完成前，使用默认语言防止闪烁
  if (!isHydrated) {
    return (
      <LanguageContext.Provider value={{ locale: 'en', toggleLocale: () => {}, setLocale: () => {} }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
