import { NextRequest, NextResponse } from 'next/server';
import { BaziResult, AIReport } from '@/types';
import { generateFullReportPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { baziResult, birthDate, birthTime } = body as {
      baziResult: BaziResult;
      birthDate: string;
      birthTime: string;
    };

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    const prompt = generateFullReportPrompt({
      baziResult,
      birthDate,
      birthTime,
    });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a wise Eastern philosophy interpreter who translates ancient Bazi wisdom into modern Western self-help language. You respond with valid JSON only, no markdown.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `LLM API error: ${response.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content as string | undefined;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty response from LLM' },
        { status: 502 }
      );
    }

    // Clean markdown code blocks if present
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const report: AIReport = JSON.parse(cleanContent);

    // Validate structure
    const required = ['overview', 'personality', 'career', 'love', 'health', 'forecast', 'advice'];
    const missing = required.filter((k) => !(k in report));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Invalid report structure, missing: ${missing.join(', ')}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ report });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
