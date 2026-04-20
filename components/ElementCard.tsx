'use client';

import { motion } from 'framer-motion';
import { ElementResult } from '@/types';
import { elementData } from '@/lib/elements';

interface ElementCardProps {
  result: ElementResult;
  showFullDescription?: boolean;
}

export default function ElementCard({ result, showFullDescription = true }: ElementCardProps) {
  const data = elementData[result.element];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-1 rounded-2xl blur-xl opacity-30"
        style={{ backgroundColor: data.color }}
      />

      {/* Card content */}
      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-10">
        {/* Element symbol */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-serif border-2"
            style={{
              color: data.color,
              borderColor: data.color,
              boxShadow: `0 0 30px ${data.color}30`,
            }}
          >
            {data.symbol}
          </div>
        </motion.div>

        {/* Element name and polarity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
            {result.archetype}
          </h2>
          <p className="text-lg" style={{ color: data.color }}>
            ({result.polarity === 'yin' ? 'Yin' : 'Yang'} {data.name})
          </p>
        </motion.div>

        {/* Keywords */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-3 mb-6 flex-wrap"
        >
          {result.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-4 py-1.5 rounded-full text-sm border"
              style={{
                color: data.color,
                borderColor: `${data.color}50`,
                backgroundColor: `${data.color}10`,
              }}
            >
              {keyword}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        {showFullDescription && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-300 text-center leading-relaxed text-base md:text-lg"
          >
            {result.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
