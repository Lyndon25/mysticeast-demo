'use client';

import { AlertTriangle } from 'lucide-react';

interface DisclaimerBannerProps {
  variant?: 'inline' | 'banner' | 'footer';
}

export default function DisclaimerBanner({ variant = 'inline' }: DisclaimerBannerProps) {
  const text = "For Entertainment Purposes Only. This is not professional medical, psychological, or financial advice.";

  if (variant === 'banner') {
    return (
      <div className="bg-amber-950/30 border-y border-amber-900/30 py-2 px-4">
        <p className="text-center text-amber-400/80 text-xs flex items-center justify-center gap-2">
          <AlertTriangle className="w-3 h-3" />
          {text}
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="py-6 px-4 border-t border-slate-800">
        <p className="text-center text-slate-500 text-xs max-w-2xl mx-auto">
          <AlertTriangle className="w-3 h-3 inline mr-1" />
          {text}
        </p>
      </div>
    );
  }

  return (
    <p className="text-slate-500 text-xs flex items-center gap-1.5">
      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
      {text}
    </p>
  );
}
