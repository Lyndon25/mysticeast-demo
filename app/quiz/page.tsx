'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import MysticButton from '@/components/MysticButton';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function QuizPage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!birthDate) {
      setError('Please enter your date of birth');
      return;
    }

    // Store in localStorage for the result page
    const birthInfo = {
      date: birthDate,
      time: birthTime,
      location: location || 'Unknown',
    };
    localStorage.setItem('mysticeast-birth-info', JSON.stringify(birthInfo));

    // Navigate to loading page
    router.push('/quiz/loading');
  };

  // Get max date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <ParticleBackground />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.push('/')}
        className="fixed top-4 left-4 z-50 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        ← Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Energy Blueprint Reading
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">
            Reveal Your Element
          </h1>
          <p className="text-slate-400">
            Enter your birth details to calculate your elemental archetype
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm text-slate-300 font-medium">
              Date of Birth <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={today}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Time of Birth */}
          <div className="space-y-2">
            <label className="block text-sm text-slate-300 font-medium">
              Time of Birth <span className="text-slate-500">(optional)</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm text-slate-300 font-medium">
              Birth Location <span className="text-slate-500">(optional)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <MysticButton type="submit" size="lg" className="w-full">
            Reveal My Element
            <ArrowRight className="w-5 h-5 ml-2" />
          </MysticButton>
        </form>

        {/* Disclaimer */}
        <div className="mt-8 flex justify-center">
          <DisclaimerBanner />
        </div>
      </motion.div>
    </main>
  );
}
