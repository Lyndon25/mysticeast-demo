'use client';

import { useState, useCallback } from 'react';
import { LLMConfig, AIReport } from '@/types';
import { generateReportPrompt, getFallbackReport } from '@/lib/prompts';

interface UseLLMOptions {
  config: LLMConfig;
}

interface UseLLMReturn {
  generateReport: (params: {
    element: string;
    polarity: string;
    birthDate: string;
  }) => Promise<AIReport>;
  isLoading: boolean;
  error: string | null;
}

export function useLLM({ config }: UseLLMOptions): UseLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (params: {
    element: string;
    polarity: string;
    birthDate: string;
  }): Promise<AIReport> => {
    setIsLoading(true);
    setError(null);

    try {
      // If no API key or demo mode, return fallback
      if (!config.apiKey || config.apiKey.trim() === '') {
        console.log('No API key provided, using fallback report');
        return getFallbackReport(
          params.element as any,
          params.polarity as any
        );
      }

      const prompt = generateReportPrompt({
        element: params.element as any,
        polarity: params.polarity as any,
        birthDate: params.birthDate,
      });

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a wise Eastern philosophy interpreter who translates ancient Bazi wisdom into modern Western self-help language. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from API');
      }

      // Try to parse JSON from response
      let report: AIReport;
      try {
        // Remove markdown code blocks if present
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        report = JSON.parse(cleanContent);
      } catch (parseError) {
        console.warn('Failed to parse JSON, using fallback:', parseError);
        return getFallbackReport(
          params.element as any,
          params.polarity as any
        );
      }

      // Validate report structure
      if (!report.career || !report.love || !report.health || !report.forecast) {
        console.warn('Invalid report structure, using fallback');
        return getFallbackReport(
          params.element as any,
          params.polarity as any
        );
      }

      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('LLM Error:', errorMessage);
      
      // Return fallback on any error
      return getFallbackReport(
        params.element as any,
        params.polarity as any
      );
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  return { generateReport, isLoading, error };
}
