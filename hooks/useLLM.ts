'use client';

import { useState, useCallback } from 'react';
import { AIReport, BaziResult } from '@/types';
import { getFallbackReport } from '@/lib/report-fallback';

interface UseLLMReturn {
  generateReport: (params: {
    baziResult: BaziResult;
    birthDate: string;
    birthTime: string;
    locale?: 'en' | 'zh';
  }) => Promise<AIReport>;
  isLoading: boolean;
  error: string | null;
}

export function useLLM(): UseLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (params: {
    baziResult: BaziResult;
    birthDate: string;
    birthTime: string;
    locale?: 'en' | 'zh';
  }): Promise<AIReport> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      const report = data.report as AIReport;

      // Validate report structure (V2: 8-chapter deep report)
      const required = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'chapter7', 'chapter8'];
      const missing = required.filter((k) => !(k in report));
      if (missing.length > 0) {
        console.warn('Invalid report structure, using fallback');
        return getFallbackReport(params.baziResult, params.locale || 'en');
      }

      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('LLM Error:', errorMessage);
      // Return fallback on any error
      return getFallbackReport(params.baziResult, params.locale || 'en');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateReport, isLoading, error };
}
