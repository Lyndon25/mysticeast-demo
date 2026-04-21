import { NextRequest, NextResponse } from 'next/server';
import { Hexagram } from '@/lib/yijing';

interface DivinationBody {
  question: string;
  mainHexagram: Hexagram;
  changedHexagram: Hexagram;
  changingLines: number[];
  lineTexts: string[];
  locale?: 'en' | 'zh';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DivinationBody;
    const {
      question,
      mainHexagram,
      changedHexagram,
      changingLines,
      locale = 'en',
    } = body;

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

    const isZh = locale === 'zh';
    const prompt = isZh
      ? `你是一位智慧的精神导师，通过现代心理学和自我反思来解读《易经》。

用户提问："${question || '我现在需要什么指引？'}"

他们的占卜结果：
- 主卦：${mainHexagram.number} - ${mainHexagram.name} (${mainHexagram.nameEn})
- 卦辞：${mainHexagram.judgment}
- 象辞：${mainHexagram.image}
${changingLines.length > 0 ? `- 变爻：第 ${changingLines.join('、')} 爻` : '- 无变爻'}
${changedHexagram.number !== mainHexagram.number ? `- 变卦：${changedHexagram.number} - ${changedHexagram.nameEn}` : ''}

请提供温暖而有洞察力的解读，分为三个部分，使用 Markdown 格式输出：
1. **当前局势** - 主卦揭示了他们现在所处的状态
2. **指引** - 变爻（如有）或核心信息的智慧
3. **行动建议** - 2-3 个具体可做的事情

用神秘但接地气的语气写作。使用现代自我帮助的语言。在内容中合理使用加粗、列表等 Markdown 语法。结尾加上："此洞察仅供娱乐和自我反思之用。"`
      : `You are a wise spiritual guide who interprets the I Ching (Book of Changes) through modern psychology and self-reflection.

The user asked: "${question || 'What guidance do I need right now?'}"

Their casting result:
- Main Hexagram: ${mainHexagram.number} - ${mainHexagram.name} (${mainHexagram.nameEn})
- Judgment: ${mainHexagram.judgment}
- Image: ${mainHexagram.image}
${changingLines.length > 0 ? `- Changing Lines: ${changingLines.join(', ')}` : '- No changing lines'}
${changedHexagram.number !== mainHexagram.number ? `- Changed Hexagram: ${changedHexagram.number} - ${changedHexagram.nameEn}` : ''}

Please provide a warm, insightful interpretation in 3 sections, using Markdown formatting:
1. **The Current Situation** - what the main hexagram reveals about where they are now
2. **The Guidance** - specific wisdom from the changing lines (if any) or the core message
3. **Actionable Steps** - 2-3 concrete things they can do

Write in a mystical yet grounded tone. Use modern self-help language. Never use Chinese terms. Use bold, lists, and other Markdown syntax for better readability. End with: "This insight is for entertainment and self-reflection purposes only."`;

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
      console.error('[LLM Error]', {
        baseUrl,
        model,
        status: response.status,
        responseBody: text.slice(0, 500),
      });
      return NextResponse.json(
        { error: `LLM API error: ${response.status} ${text.slice(0, 200)}` },
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
