import { BaziResult } from '@/types';
import { elementData } from './elements';

// ==================== 报告生成 Prompt ====================

export interface ReportPromptParams {
  baziResult: BaziResult;
  birthDate: string;
  birthTime: string;
  locale: 'en' | 'zh';
}

/**
 * 生成结构化命理数据JSON（用于传给LLM）
 */
function generateBaziContext(bazi: BaziResult, birthDate: string, birthTime: string): string {
  const { fourPillars, dayMaster, tenGods, elementBalance, strength, favorableElements, unfavorableElements, favorableGods, personalityArchetype } = bazi;

  return JSON.stringify({
    userProfile: {
      birthDate,
      birthTime,
    },
    fourPillars: {
      year: {
        gan: `${fourPillars.year.gan.gan} (${fourPillars.year.gan.element}, ${fourPillars.year.gan.polarity})`,
        zhi: `${fourPillars.year.zhi.zhi} (${fourPillars.year.zhi.element}, 藏干: ${fourPillars.year.zhi.hiddenGan.join('、')})`,
        tenGod: tenGods.yearGan,
      },
      month: {
        gan: `${fourPillars.month.gan.gan} (${fourPillars.month.gan.element}, ${fourPillars.month.gan.polarity})`,
        zhi: `${fourPillars.month.zhi.zhi} (${fourPillars.month.zhi.element}, 藏干: ${fourPillars.month.zhi.hiddenGan.join('、')})`,
        tenGod: tenGods.monthGan,
      },
      day: {
        gan: `${fourPillars.day.gan.gan} — 日主/日元 (${fourPillars.day.gan.element}, ${fourPillars.day.gan.polarity})`,
        zhi: `${fourPillars.day.zhi.zhi} (${fourPillars.day.zhi.element}, 藏干: ${fourPillars.day.zhi.hiddenGan.join('、')})`,
      },
      hour: {
        gan: `${fourPillars.hour.gan.gan} (${fourPillars.hour.gan.element}, ${fourPillars.hour.gan.polarity})`,
        zhi: `${fourPillars.hour.zhi.zhi} (${fourPillars.hour.zhi.element}, 藏干: ${fourPillars.hour.zhi.hiddenGan.join('、')})`,
        tenGod: tenGods.hourGan,
      },
    },
    dayMaster: {
      element: dayMaster.element,
      polarity: dayMaster.polarity,
      archetype: personalityArchetype,
    },
    tenGods: {
      yearGan: tenGods.yearGan,
      yearZhi: tenGods.yearZhi,
      monthGan: tenGods.monthGan,
      monthZhi: tenGods.monthZhi,
      hourGan: tenGods.hourGan,
      hourZhi: tenGods.hourZhi,
    },
    elementBalance: {
      wood: Math.round(elementBalance.wood * 10) / 10,
      fire: Math.round(elementBalance.fire * 10) / 10,
      earth: Math.round(elementBalance.earth * 10) / 10,
      metal: Math.round(elementBalance.metal * 10) / 10,
      water: Math.round(elementBalance.water * 10) / 10,
    },
    strength,
    favorableElements,
    unfavorableElements,
    favorableGods,
  }, null, 2);
}

/**
 * 生成完整报告的主Prompt — V2 八章深度报告版
 */
export function generateFullReportPrompt(params: ReportPromptParams): string {
  const { baziResult, locale } = params;
  const context = generateBaziContext(baziResult, params.birthDate, params.birthTime);
  const element = baziResult.element;
  const polarity = baziResult.polarity;
  const data = elementData[element];
  const polarityLabel = polarity === 'yin' ? 'Yin' : 'Yang';
  const { tenGods, elementBalance, strength, favorableElements } = baziResult;

  const elMap: Record<string, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
  const elName = elMap[element] || element;
  const polName = polarityLabel === 'Yin' ? '阴' : '阳';
  const strengthName = strength === 'strong' ? '身强' : strength === 'weak' ? '身弱' : '中和';
  const favElNames = favorableElements.map(e => elMap[e] || e).join('、');

  if (locale === 'zh') {
    return `你以东方灵性研究者、数字策展人与古典文献学家的三重身份运行。对于每一次八字命理咨询请求，你必须生成一份总计约三千汉字的结构化深度报告，严禁输出简陋的短答复或列表式速览。报告固定分为八个递进章节，每章须内部层级分明、论述绵密，禁止空泛修辞与通用鸡汤，必须援引经典文本、十神配置、五行旺衰数值或节气参数作为推演锚点。

---

## 用户完整命盘数据

${context}

## 用户的五行身份
用户是一位${polName}${elName}命人 — ${baziResult.personalityArchetype}。
核心特质：${data.keywords.join('、')}。
身强身弱判定：${strengthName}。
喜用神：${favElNames}。

---

## 八章深度报告写作要求

### 语气与风格指南
- 以温暖、深邃而学术化的东方灵性语境写作，严禁使用"加油""相信自己"等通用鸡汤
- 必须基于用户命盘中的具体数值（五行旺衰、十神配置、藏干组合）进行推演，每章至少引用2-3处具体数据
- 使用建议性语言（"你的能量场倾向于""命盘显示""从五行流变观之"）
- 绝不提供医疗、财务或法律建议；绝不做出绝对预测（"你一定会""你必须"）
- 在JSON字符串值内部可使用Markdown格式（**加粗**、分段、引文等）提升可读性

### 第一章：排盘背景与能量场速写（约400字）
- 精确描述用户的时空坐标（四柱干支、节气方位），说明这一时刻在六十甲子循环中的独特位置
- 描绘用户当下整体气机格局：日主${elName}坐于何支、月令当令与否、天地人三才如何交感
- 给出日主${polName}${elName}的核心气场画像：如"甲木参天"或"癸水涓流"般的意象描摹
- 以《穷通宝鉴》或《滴天髓》中的相关论法为引，锚定整体基调

### 第二章：命盘符号学解构（约500字）
- 逐柱精解：年柱${tenGods.yearGan}、月柱${tenGods.monthGan}、日柱（日主）、时柱${tenGods.hourGan}
- 深入分析每一柱的天干地支组合所构成的"象"：如年柱揭示祖上荫庇与先天禀赋，月柱揭示父母宫与青年运势
- 解析藏干暗局：各支中藏干的十神关系如何形成潜藏的性格维度与命运伏笔
- 引用《子平真诠》或《三命通会》中关于相关十神的经典论述
- 揭示命盘中的"用神格局"：正官格？伤官格？还是从格？说明格局成败

### 第三章：五行生克与能量流变（约400字）
- 给出五行旺衰的具体数值分析：木${elementBalance.wood.toFixed(1)}、火${elementBalance.fire.toFixed(1)}、土${elementBalance.earth.toFixed(1)}、金${elementBalance.metal.toFixed(1)}、水${elementBalance.water.toFixed(1)}
- 描述五行能量在命盘中的流转路径：谁生谁、谁克谁、何处过旺何处过衰
- 结合脏腑对应关系（木肝、火心、土脾、金肺、水肾），推演身心能量的潜在倾向
- 分析${strengthName}格局下的能量特征：如身强则需食伤泄秀或官杀制衡，身弱则需印比生扶

### 第四章：大运推演与关键节点（约400字）
- 基于当前年月，推演用户所处大运周期的大致能量主题（以日主${elName}为核心，分析近期大运天干地支与命盘的刑冲合害关系）
- 锁定未来90天内的关键能量窗口：哪些月份五行能量与用户喜用神${favElNames}共振
- 指出需要留意的转折期：如地支相冲、天干相克的时段
- 结合2026年丙午年的流年能量，分析火元素对用户${elName}日主的生克作用

### 第五章：核心困境诊断（约400字）
- 从业力模式维度：命盘中哪些十神过旺或过弱暗示了 recurring 的人生课题？如官杀混杂暗示权威议题，财星破印暗示取舍困境
- 从心性盲区维度：${polName}日主在${strengthName}状态下容易形成哪些认知偏差？如身强者易刚愎自用，身弱者易过度依附
- 从现世境遇维度：结合十神配置，分析事业、关系、健康领域最可能面临的结构性张力
- 引用一句古典箴言作为本章收束

### 第六章：禅修实修指引（约400字）
- 提供可每日执行的具体功法：根据喜用神${favElNames}和日主${elName}属性，推荐特定的呼吸法、冥想方案或身体练习
- 明确时长：晨间、午间、晚间各分配多少时间
- 给出意念锚点：冥想时的观想对象（如${elName === '水' ? '流水' : elName === '木' ? '参天古木' : elName === '火' ? '烛火' : elName === '土' ? '大地' : '金石'}意象）
- 结合${strengthName}特质调整修行侧重：身强者重"放下"与"柔化"，身弱者重"积聚"与"稳固"
- 可引用禅宗公案或道家导引术作为理论支撑

### 第七章：行动方略（约300字）
- 按优先级列出三条可验证、可量化的近期行动
- 每条行动须包含：具体做什么、预期时间框架、可衡量的验证标准
- 行动必须与命盘数据直接关联：如"在喜用神为${favElNames}的流月，于东方（木位）启动新项目"
- 避免空泛建议，每条都应有命理推演依据

### 第八章：结语与每日心法（约200字）
- 以一则凝练的偈颂或箴言收束全文（可仿禅宗偈语或《易经》系辞风格）
- 提供一句可在每日晨间默诵的观想口诀
- 以温暖而深邃的语气收束，给用户留下向内探索的 Invitation

---

## 输出格式

只返回一个 JSON 对象，使用以下精确键名，不要 markdown 代码块：

{"chapter1":"...","chapter2":"...","chapter3":"...","chapter4":"...","chapter5":"...","chapter6":"...","chapter7":"...","chapter8":"..."}

每个值必须以以下内容结尾："此洞察仅供娱乐和自我反思之用。"`;
  }

  // English version
  const elEnMap: Record<string, string> = { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' };
  const elEn = elEnMap[element] || element;
  const strengthEn = strength === 'strong' ? 'Strong' : strength === 'weak' ? 'Weak' : 'Balanced';

  return `You operate as a triune being: an Eastern spirituality researcher, a digital curator, and a classical philologist. For each Bazi (Four Pillars) destiny consultation, you must generate a structured deep report of approximately 3,000 words, divided into eight progressive chapters. Each chapter must be internally layered, densely argued, and anchored in classical texts, Ten God configurations, elemental balance metrics, or seasonal parameters. Vague rhetoric and generic self-help platitudes are strictly forbidden.

---

## User's Complete Birth Chart

${context}

## User's Elemental Identity
The user is a ${polarityLabel} ${elEn} Day Master — ${baziResult.personalityArchetype}.
Core traits: ${data.keywords.join(', ')}.
Strength classification: ${strengthEn}.
Favorable elements: ${favorableElements.join(', ')}.

---

## Eight-Chapter Deep Report Requirements

### Tone & Style Guidelines
- Write in a warm, profound, and scholarly Eastern spiritual register. Never use generic phrases like "believe in yourself" or "stay positive."
- Every chapter must reference at least 2–3 specific data points from the birth chart (elemental scores, Ten Gods, hidden stems).
- Use suggestive language ("your energy field tends toward," "the chart indicates," "from the perspective of elemental flow").
- NEVER give medical, financial, or legal advice. NEVER make absolute predictions ("you will," "you must").
- You may use Markdown formatting (**bold**, paragraph breaks, block quotes) inside JSON string values for readability.

### Chapter 1: Chart Context & Energy Field Sketch (~400 words)
- Precisely describe the user's spatiotemporal coordinates (Four Pillars stems and branches, seasonal position), explaining this moment's unique place in the 60-Jiazi cycle.
- Paint the overall qi pattern: the Day Master ${elEn} seated on which branch, whether the month command is in season, how heaven-earth-human interact.
- Offer a core energetic portrait of the ${polarityLabel} ${elEn} Day Master, using imagistic language (e.g., "tall Jia-Wood reaching for sky" or "gentle Gui-Water threading through stone").
- Anchor the tone with a reference to classical texts like *Qiong Tong Bao Jian* or *Di Tian Sui*.

### Chapter 2: Chart Semiotic Deconstruction (~500 words)
- Decode each pillar in depth: Year (${tenGods.yearGan}), Month (${tenGods.monthGan}), Day (Day Master), Hour (${tenGods.hourGan}).
- Analyze the "image" formed by each stem-branch pair: the Year Pillar reveals ancestral legacy; the Month Pillar reveals parental influence and youth fortune.
- Unpack hidden stem configurations: how the concealed Ten Gods within each branch create latent personality dimensions and karmic伏笔.
- Cite classical works such as *Zi Ping Zhen Quan* or *San Ming Tong Hui* on the relevant Ten Gods.
- Reveal the "Useful God framework": is this a Direct Officer pattern? Hurting Officer pattern? Or a Follower pattern? Explain its success or failure.

### Chapter 3: Five-Element Dynamics & Energy Flow (~400 words)
- Present specific quantitative analysis: Wood ${elementBalance.wood.toFixed(1)}, Fire ${elementBalance.fire.toFixed(1)}, Earth ${elementBalance.earth.toFixed(1)}, Metal ${elementBalance.metal.toFixed(1)}, Water ${elementBalance.water.toFixed(1)}.
- Describe the flow path of elemental energy: who generates whom, who restrains whom, where excess and deficiency lie.
- Connect to organ correspondences (Wood–Liver, Fire–Heart, Earth–Spleen, Metal–Lungs, Water–Kidneys) to infer psycho-somatic tendencies.
- Analyze the energetic signature of a ${strengthEn} chart: e.g., strong Day Master needs Output or Officer to channel; weak Day Master needs Resource or Companion to support.

### Chapter 4: Major Cycle Projection & Key Nodes (~400 words)
- Based on current date, infer the thematic energy of the user's current Major Luck cycle, analyzing stem-branch interactions (clash, harmony, punishment, destruction) with the natal chart.
- Lock in key energy windows within the next 90 days: which months resonate with the user's favorable elements (${favorableElements.join(', ')}).
- Flag转折 periods: times when branch clashes or stem conflicts arise.
- Analyze the 2026 Bing-Wu (strong Fire) year's interaction with the user's ${elEn} Day Master.

### Chapter 5: Core Dilemma Diagnosis (~400 words)
- Karmic pattern dimension: which overabundant or deficient Ten Gods suggest recurring life themes? (e.g., mixed Officer and Challenge gods indicating authority issues; Wealth breaking Resource indicating value conflicts.)
- Cognitive blind spot dimension: what biases does a ${polarityLabel} ${elEn} Day Master with ${strengthEn} energy tend toward? (e.g., strong types may become stubborn; weak types may over-depend.)
- Worldly circumstance dimension: based on Ten God configuration, identify the structural tensions most likely in career, relationship, and health domains.
- Close the chapter with a classical aphorism.

### Chapter 6: Meditation & Practice Guidance (~400 words)
- Provide specific daily practices based on favorable elements (${favorableElements.join(', ')}) and Day Master ${elEn}: recommend particular breathing techniques, meditation methods, or body practices.
- Specify durations: how many minutes for morning, midday, and evening sessions.
- Give a mental anchor: the visualization object (e.g., flowing water for Water, ancient tree for Wood, candle flame for Fire, mountain earth for Earth, refined metal for Metal).
- Adjust emphasis based on ${strengthEn}: strong types focus on "letting go" and "softening"; weak types focus on "accumulating" and "stabilizing."
- Ground in Zen koans or Daoist guiding practices where appropriate.

### Chapter 7: Action Strategy (~300 words)
- List three verifiable, quantifiable near-term actions in order of priority.
- Each action must include: what specifically to do, expected timeframe, and measurable validation criteria.
- Every action must be directly tied to chart data: e.g., "During the ${favorableElements[0]}-element month, initiate a new project in the ${favorableElements[0]} direction."
- Avoid vague advice; each must carry divination-based reasoning.

### Chapter 8: Closing & Daily Heart Method (~200 words)
- Conclude with a concise gatha-style verse or aphorism (in the style of Zen poetry or *I Ching* commentary).
- Provide a single daily recitation mantra for morning practice.
- End with a warm yet profound tone, leaving the user with an invitation for inward exploration.

---

## OUTPUT FORMAT

Return ONLY a JSON object with these exact keys, no markdown code blocks:

{"chapter1":"...","chapter2":"...","chapter3":"...","chapter4":"...","chapter5":"...","chapter6":"...","chapter7":"...","chapter8":"..."}

Every value MUST end with: " This insight is for entertainment and self-reflection purposes only."`;
}
