# MysticEast AI — 东方秘境 v2

基于真实东方八字智慧与易经64卦的 AI 算命应用。新中式极简美学风格，支持服务端 LLM 调用。

## 功能特性

- **真实八字排盘**：天干地支四柱、十神分析、五行强弱、喜用神推导
- **AI 深度报告**：基于完整八字数据的7维度个性化报告（人格/事业/感情/健康/流年/每日练习）
- **AI 易经占卜**：64卦全库、三铜钱投掷动画、AI解卦指引
- **服务端 API 保护**：API Key 存储在服务端环境变量，前端不暴露密钥

## 技术栈

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion

## 本地开发

```bash
npm install
npm run dev
```

应用运行在 http://localhost:3000

## 环境变量配置

项目使用服务端 API Route 调用 LLM，因此需要在服务端配置 API Key。

### 1. 复制示例文件

```bash
cp .env.example .env.local
```

### 2. 编辑 `.env.local`，填入你的 API Key

```env
# 必填：OpenAI API Key（或任意 OpenAI 兼容 API Key）
OPENAI_API_KEY=sk-your-api-key-here

# 可选：自定义 Base URL（如 Azure、DeepSeek、Groq 等）
OPENAI_BASE_URL=https://api.openai.com/v1

# 可选：模型名称，默认 gpt-4o-mini
OPENAI_MODEL=gpt-4o-mini
```

> **安全提示**：`.env.local` 已被加入 `.gitignore`，不会被提交到 Git。

### 3. 重启开发服务器

修改环境变量后需要重启 `npm run dev`。

## Vercel 部署

### 方式一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel --prod
```

部署过程中会提示你设置环境变量，将 `OPENAI_API_KEY` 等填入即可。

### 方式二：通过 Vercel Dashboard

1. 将代码 Push 到 GitHub
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 导入项目
3. 进入 **Project Settings → Environment Variables**
4. 添加以下变量：
   - `OPENAI_API_KEY` = 你的 API Key
   - `OPENAI_BASE_URL` = `https://api.openai.com/v1`（或使用其他兼容端点）
   - `OPENAI_MODEL` = `gpt-4o-mini`（或 `gpt-4o` 等）
5. 重新部署（Redeploy）

### 关于 API Key 的安全设计

- **旧方案**：API Key 存储在浏览器 localStorage，通过前端直接调用 LLM API → 密钥暴露给所有用户
- **新方案**：API Key 仅存储在服务端环境变量，前端通过 Next.js API Route (`/api/chat`, `/api/divination`) 间接调用 → 密钥完全隐藏

## 项目结构

```
app/
  api/
    chat/route.ts          # 八字报告 LLM API 代理
    divination/route.ts    # 易经占卜 LLM API 代理
  divination/page.tsx      # 易经占卜页面
  quiz/result/page.tsx     # 八字排盘结果页
  report/page.tsx          # AI 报告页
lib/
  bazi.ts                  # 真实八字排盘引擎
  yijing.ts                # 易经64卦数据库
  prompts.ts               # LLM Prompt 模板
hooks/
  useLLM.ts                # 客户端调用服务端 API Route
```

## 免费/付费边界

- **免费**：八字排盘结果（四柱、五行、十神、喜用神）、易经卦象显示
- **付费/完整**：AI 生成的7维度深度报告、AI 解卦个性化指引

> 未配置 API Key 时，系统会自动生成基于八字数据的个性化降级报告，保证演示可用。

## 免责声明

本应用所有内容仅供娱乐和自我反思参考，不构成任何专业建议（医疗、法律、财务等）。
