import { NextRequest, NextResponse } from 'next/server';
import { BaziResult, AIReport } from '@/types';
import { generateFullReportPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { baziResult, birthDate, birthTime, locale } = body as {
      baziResult: BaziResult;
      birthDate: string;
      birthTime: string;
      locale?: 'en' | 'zh';
    };

    const apiKey = process.env.OPENAI_API_KEY;
    const rawBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || '';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: 'OPENAI_MODEL not configured. Please set it to your provider-specific model ID, e.g. Qwen/Qwen2.5-72B-Instruct for SiliconFlow.' },
        { status: 500 }
      );
    }

    // Normalize base URL: ensure it ends with /v1 (some providers omit it)
    let baseUrl = rawBaseUrl.replace(/\/$/, '');
    if (!baseUrl.endsWith('/v1')) {
      baseUrl = `${baseUrl}/v1`;
    }

    const prompt = generateFullReportPrompt({
      baziResult,
      birthDate,
      birthTime,
      locale: locale || 'en',
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
              locale === 'zh'
                ? '你是一位智慧的东西方哲学翻译者，将古老的八字智慧转化为现代心理学和自我帮助语言。你只返回合法的 JSON。在 JSON 字符串值中，你可以使用 Markdown 格式（加粗、列表等）来提升可读性。'
                : 'You are a wise Eastern philosophy interpreter who translates ancient Bazi wisdom into modern Western self-help language. You respond with valid JSON only. Within each JSON string value, you may use Markdown formatting (bold, lists, etc.) for better readability.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[LLM Error]', {
        baseUrl,
        model,
        status: response.status,
        responseBody: text.slice(0, 500),
        requestBodyPreview: prompt.slice(0, 200),
      });
      return NextResponse.json(
        { error: `LLM API error: ${response.status} ${text.slice(0, 200)}` },
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
