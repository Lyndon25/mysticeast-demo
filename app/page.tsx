'use client';

import { motion } from 'framer-motion';
import { Sparkles, Compass, BookOpen, ChevronDown } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';
import { t } from '@/lib/i18n';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Los Angeles',
    text: "I've tried countless astrology apps, but this felt deeply personal. The Growth Pioneer description resonated with my entire career journey.",
    element: 'Wood',
  },
  {
    name: 'James K.',
    location: 'New York',
    text: "The level of detail in my report was incredible. It helped me understand why I've always been drawn to creative leadership roles.",
    element: 'Fire',
  },
  {
    name: 'Elena R.',
    location: 'London',
    text: "Finally, a spiritual tool that feels sophisticated rather than gimmicky. The insights about my relationships were remarkably accurate.",
    element: 'Water',
  },
];

export default function LandingPage() {
  const { locale } = useLanguage();

  const steps = [
    {
      icon: Compass,
      title: t('landing.steps.0.title', locale),
      description: t('landing.steps.0.desc', locale),
    },
    {
      icon: Sparkles,
      title: t('landing.steps.1.title', locale),
      description: t('landing.steps.1.desc', locale),
    },
    {
      icon: BookOpen,
      title: t('landing.steps.2.title', locale),
      description: t('landing.steps.2.desc', locale),
    },
  ];

  return (
    <main className="relative min-h-screen">
      <ParticleBackground />

      {/* Top-right controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full top-1/4 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[300px] h-[300px] bg-amber-900/10 blur-[100px] rounded-full bottom-1/4 right-1/4" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm">
              <Sparkles className="w-4 h-4" />
              {t('landing.badge', locale)}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif mb-6 tracking-tight leading-tight"
          >
            {locale === 'zh' ? (
              <>
                解锁你的
                <span className="text-cyan-400">命盘</span>
                蓝图
              </>
            ) : (
              <>
                Unlock Your{' '}
                <span className="text-cyan-400">Ancient</span>{' '}
                Blueprint
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-400 mb-10 font-light leading-relaxed max-w-2xl mx-auto"
          >
            {t('landing.subtitle', locale)}
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <MysticButton href="/quiz" size="lg">
              {t('landing.cta.discover', locale)}
            </MysticButton>
            <MysticButton href="/divination" size="lg" className="border-amber-500/30 hover:border-amber-400">
              {t('landing.cta.oracle', locale)}
            </MysticButton>
          </motion.div>

          {/* Disclaimer */}
          <motion.div variants={fadeInUp} className="mt-6">
            <DisclaimerBanner />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-slate-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              {t('landing.howItWorks.title', locale)}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {t('landing.howItWorks.subtitle', locale)}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative"
              >
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-cyan-500/20 transition-colors">
                    <step.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-cyan-400 text-sm font-medium mb-3">
                    {t('landing.step', locale)} {index + 1}
                  </div>
                  <h3 className="text-xl font-serif text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              {t('landing.testimonials.title', locale)}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-slate-900/30 border border-slate-800 rounded-xl p-6"
              >
                <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center text-cyan-400 text-sm font-medium">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{item.name}</div>
                    <div className="text-slate-500 text-xs">{item.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              {t('landing.ctaSection.title', locale)}
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              {t('landing.ctaSection.subtitle', locale)}
            </p>
            <MysticButton href="/quiz" size="lg">
              {t('landing.ctaSection.button', locale)}
            </MysticButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              {t('landing.footer.copyright', locale)}
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-slate-500 hover:text-cyan-400 transition-colors">
                {t('landing.footer.privacy', locale)}
              </a>
              <a href="/terms" className="text-slate-500 hover:text-cyan-400 transition-colors">
                {t('landing.footer.terms', locale)}
              </a>
            </div>
          </div>
          <DisclaimerBanner variant="footer" />
        </div>
      </footer>

    </main>
  );
}
