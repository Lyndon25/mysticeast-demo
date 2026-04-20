import { NextRequest, NextResponse } from 'next/server';
import { Hexagram } from '@/lib/yijing';

interface DivinationBody {
  question: string;
  mainHexagram: Hexagram;
  changedHexagram: Hexagram;
  changingLines: number[];
  lineTexts: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DivinationBody;
    const {
      question,
      mainHexagram,
      changedHexagram,
      changingLines,
      lineTexts,
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    const prompt = `You are a wise spiritual guide who interprets the I Ching (Book of Changes) through modern psychology and self-reflection.

The user asked: "${question || 'What guidance do I need right now?'}"

Their casting result:
- Main Hexagram: ${mainHexagram.number} - ${mainHexagram.name} (${mainHexagram.nameEn})
- Judgment: ${mainHexagram.judgment}
- Image: ${mainHexagram.image}
${changingLines.length > 0 ? `- Changing Lines: ${changingLines.join(', ')}` : '- No changing lines'}
${changedHexagram.number !== mainHexagram.number ? `- Changed Hexagram: ${changedHexagram.number} - ${changedHexagram.nameEn}` : ''}

Please provide a warm, insightful interpretation in 3 sections:
1. The Current Situation - what the main hexagram reveals about where they are now
2. The Guidance - specific wisdom from the changing lines (if any) or the core message
3. Actionable Steps - 2-3 concrete things they can do

Write in a mystical yet grounded tone. Use modern self-help language. Never use Chinese terms. End with: "This insight is for entertainment and self-reflection purposes only."`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1200,
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
    const interpretation = data.choices?.[0]?.message?.content as string | undefined;

    if (!interpretation) {
      return NextResponse.json(
        { error: 'Empty response from LLM' },
        { status: 502 }
      );
    }

    return NextResponse.json({ interpretation });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
