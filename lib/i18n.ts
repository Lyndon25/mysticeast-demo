/**
 * MysticEast AI - Internationalization (i18n)
 * 支持中英文切换
 */

export type Locale = 'en' | 'zh';

// ===== 翻译字典 =====
const translations = {
  // --- 通用 ---
  'nav.backToHome': {
    en: '← Back to Home',
    zh: '← 返回首页',
  },
  'nav.backToResult': {
    en: '← Back to Result',
    zh: '← 返回结果',
  },

  // --- 首页 Landing ---
  'landing.badge': {
    en: '5,000 Years of Eastern Wisdom, Powered by AI',
    zh: '五千年东方智慧，AI 驱动',
  },
  'landing.title': {
    en: 'Unlock Your Ancient Blueprint',
    zh: '解锁你的命盘蓝图',
  },
  'landing.subtitle': {
    en: 'Moving beyond generic horoscopes. Discover your true elemental nature through the time-honored wisdom of Bazi.',
    zh: '超越泛泛的星座运势。通过古老的八字智慧，发现你真正的五行本性。',
  },
  'landing.cta.discover': {
    en: 'Discover Your Element — Free',
    zh: '探索你的五行 — 免费',
  },
  'landing.cta.oracle': {
    en: 'Ask the Oracle',
    zh: '向神谕提问',
  },
  'landing.howItWorks.title': {
    en: 'How It Works',
    zh: '如何运作',
  },
  'landing.howItWorks.subtitle': {
    en: 'Three simple steps to reveal your elemental blueprint',
    zh: '三个简单步骤，揭示你的五行蓝图',
  },
  'landing.step': {
    en: 'Step',
    zh: '步骤',
  },
  'landing.steps.0.title': {
    en: 'Enter Your Birth Details',
    zh: '输入出生信息',
  },
  'landing.steps.0.desc': {
    en: 'Share your birth date, time, and location to begin the ancient calculation.',
    zh: '分享你的出生日期、时间和地点，开启古老的计算之旅。',
  },
  'landing.steps.1.title': {
    en: 'AI Analyzes Your Blueprint',
    zh: 'AI 分析你的命盘',
  },
  'landing.steps.1.desc': {
    en: 'Our system maps your elemental archetype using time-honored Eastern wisdom.',
    zh: '系统运用东方古老智慧，绘出你的五行原型。',
  },
  'landing.steps.2.title': {
    en: 'Unlock Personalized Insights',
    zh: '解锁个性化洞察',
  },
  'landing.steps.2.desc': {
    en: 'Receive your unique Energy Blueprint covering career, love, health, and forecast.',
    zh: '获得专属能量蓝图，涵盖事业、爱情、健康与运势。',
  },
  'landing.testimonials.title': {
    en: 'What Seekers Say',
    zh: '探索者怎么说',
  },
  'landing.ctaSection.title': {
    en: 'Ready to Discover Your Element?',
    zh: '准备好发现你的五行了吗？',
  },
  'landing.ctaSection.subtitle': {
    en: 'Your personalized Energy Blueprint awaits. It takes less than a minute to begin your journey of self-discovery.',
    zh: '你的个性化能量蓝图正等着你。不到一分钟，即可开启自我发现之旅。',
  },
  'landing.ctaSection.button': {
    en: 'Start Your Free Reading',
    zh: '开始免费测算',
  },
  'landing.footer.copyright': {
    en: '© 2026 MysticEast AI. All rights reserved.',
    zh: '© 2026 MysticEast AI. 保留所有权利。',
  },
  'landing.footer.privacy': {
    en: 'Privacy Policy',
    zh: '隐私政策',
  },
  'landing.footer.terms': {
    en: 'Terms of Service',
    zh: '服务条款',
  },

  // --- Quiz 页面 ---
  'quiz.badge': {
    en: 'Energy Blueprint Reading',
    zh: '能量蓝图测算',
  },
  'quiz.title': {
    en: 'Reveal Your Element',
    zh: '揭示你的五行',
  },
  'quiz.subtitle': {
    en: 'Enter your birth details to calculate your elemental archetype',
    zh: '输入你的出生信息，计算五行原型',
  },
  'quiz.label.date': {
    en: 'Date of Birth',
    zh: '出生日期',
  },
  'quiz.label.time': {
    en: 'Time of Birth',
    zh: '出生时间',
  },
  'quiz.label.location': {
    en: 'Birth Location',
    zh: '出生地点',
  },
  'quiz.optional': {
    en: 'optional',
    zh: '可选',
  },
  'quiz.placeholder.location': {
    en: 'City, Country',
    zh: '城市, 国家',
  },
  'quiz.error.dateRequired': {
    en: 'Please enter your date of birth',
    zh: '请输入出生日期',
  },
  'quiz.submit': {
    en: 'Reveal My Element',
    zh: '揭示我的五行',
  },

  // --- Loading 页面 ---
  'loading.messages.0': {
    en: 'Calculating your Four Pillars...',
    zh: '正在计算你的四柱八字...',
  },
  'loading.messages.1': {
    en: 'Mapping your Elemental Archetype...',
    zh: '正在绘制你的五行原型...',
  },
  'loading.messages.2': {
    en: 'Consulting ancient manuscripts...',
    zh: '正在查阅古老典籍...',
  },
  'loading.messages.3': {
    en: 'Aligning cosmic energies...',
    zh: '正在校准宇宙能量...',
  },
  'loading.messages.4': {
    en: 'Decoding your destiny blueprint...',
    zh: '正在解码你的命运蓝图...',
  },
  'loading.subtext': {
    en: 'Ancient wisdom meets modern intelligence',
    zh: '古老智慧与现代智能的交汇',
  },

  // --- Result 页面 ---
  'result.badge': {
    en: 'Your Energy Blueprint — Revealed',
    zh: '你的能量蓝图 — 已揭示',
  },
  'result.fourPillars.title': {
    en: 'Your Four Pillars',
    zh: '你的四柱八字',
  },
  'result.pillar.year': {
    en: 'Year',
    zh: '年柱',
  },
  'result.pillar.month': {
    en: 'Month',
    zh: '月柱',
  },
  'result.pillar.day': {
    en: 'Day',
    zh: '日柱',
  },
  'result.pillar.hour': {
    en: 'Hour',
    zh: '时柱',
  },
  'result.dayMaster': {
    en: 'Day Master',
    zh: '日主',
  },
  'result.elementalBalance.title': {
    en: 'Elemental Balance',
    zh: '五行能量',
  },
  'result.elementalBalance.favorable': {
    en: 'Favorable Element',
    zh: '喜用五行',
  },
  'result.elementalBalance.strength': {
    en: 'Strength',
    zh: '身强/身弱',
  },
  'result.strength.strong': {
    en: 'strong',
    zh: '身强',
  },
  'result.strength.weak': {
    en: 'weak',
    zh: '身弱',
  },
  'result.strength.neutral': {
    en: 'neutral',
    zh: '中和',
  },
  'result.description.title': {
    en: 'Your Elemental Nature',
    zh: '你的五行本性',
  },
  'result.yourArchetype': {
    en: 'Your Archetype',
    zh: '你的命格原型',
  },
  'result.viewFullReport': {
    en: 'View Full Report',
    zh: '查看完整报告',
  },
  'result.loading': {
    en: 'Calculating your ancient blueprint...',
    zh: '正在计算你的命盘蓝图...',
  },

  // --- Report 页面 ---
  'report.badge': {
    en: 'Your Energy Blueprint',
    zh: '你的能量蓝图',
  },
  'report.polarity.yin': {
    en: 'Yin',
    zh: '阴',
  },
  'report.polarity.yang': {
    en: 'Yang',
    zh: '阳',
  },
  'report.dayMasterLabel': {
    en: 'Day Master',
    zh: '日主',
  },
  'report.locked.title': {
    en: 'Unlock Your Full Report',
    zh: '解锁完整报告',
  },
  'report.locked.subtitle': {
    en: 'Generate a personalized 8-chapter deep AI report based on your complete Four Pillars birth chart — approximately 3,000 words.',
    zh: '基于你完整的四柱八字，生成个性化的八章深度 AI 分析报告——约三千汉字。',
  },
  'report.locked.preview': {
    en: 'Free Preview',
    zh: '免费预览',
  },
  'report.locked.element': {
    en: 'Element',
    zh: '五行',
  },
  'report.locked.polarity': {
    en: 'Polarity',
    zh: '阴阳',
  },
  'report.locked.strength': {
    en: 'Strength',
    zh: '身强身弱',
  },
  'report.locked.favorable': {
    en: 'Favorable',
    zh: '喜用',
  },
  'report.locked.aiStatus': {
    en: 'AI-Powered Full Report',
    zh: 'AI 驱动的完整报告',
  },
  'report.locked.generate': {
    en: 'Generate Full Report',
    zh: '生成完整报告',
  },
  'report.locked.generating': {
    en: 'Generating your report...',
    zh: '正在生成报告...',
  },
  'report.loading': {
    en: 'Loading your blueprint...',
    zh: '正在加载你的命盘...',
  },
  'report.tabs.overview': {
    en: 'Overview',
    zh: '总览',
  },
  'report.tabs.personality': {
    en: 'Personality',
    zh: '性格',
  },
  'report.tabs.career': {
    en: 'Career & Purpose',
    zh: '事业与使命',
  },
  'report.tabs.love': {
    en: 'Relationships & Love',
    zh: '感情与爱情',
  },
  'report.tabs.health': {
    en: 'Health & Wellness',
    zh: '健康与养生',
  },
  'report.tabs.forecast': {
    en: '2026 Forecast',
    zh: '2026 年运势',
  },
  'report.tabs.advice': {
    en: 'Daily Practice',
    zh: '日常修炼',
  },
  // V2 八章深度报告标题
  'report.chapter1.title': {
    en: 'Chart Context & Energy Field',
    zh: '排盘背景与能量场速写',
  },
  'report.chapter2.title': {
    en: 'Chart Semiotic Deconstruction',
    zh: '命盘符号学解构',
  },
  'report.chapter3.title': {
    en: 'Five-Element Dynamics',
    zh: '五行生克与能量流变',
  },
  'report.chapter4.title': {
    en: 'Major Cycle Projection',
    zh: '大运推演与关键节点',
  },
  'report.chapter5.title': {
    en: 'Core Dilemma Diagnosis',
    zh: '核心困境诊断',
  },
  'report.chapter6.title': {
    en: 'Meditation & Practice Guidance',
    zh: '禅修实修指引',
  },
  'report.chapter7.title': {
    en: 'Action Strategy',
    zh: '行动方略',
  },
  'report.chapter8.title': {
    en: 'Closing & Daily Heart Method',
    zh: '结语与每日心法',
  },

  // --- Divination 页面 ---
  'divination.badge': {
    en: 'I Ching Divination',
    zh: '易经占卜',
  },
  'divination.title': {
    en: 'Ask the Oracle',
    zh: '向神谕提问',
  },
  'divination.intro': {
    en: 'The I Ching has guided seekers for 3,000 years. Cast the virtual coins and receive wisdom tailored to your question.',
    zh: '易经已引导求道者三千年。投掷虚拟铜钱，获得专属于你的智慧。',
  },
  'divination.start': {
    en: 'Begin the Reading',
    zh: '开始占卜',
  },
  'divination.question.title': {
    en: 'What weighs on your heart?',
    zh: '什么事压在心头？',
  },
  'divination.question.subtitle': {
    en: 'Enter your question, or leave it blank for general guidance.',
    zh: '输入你的问题，或留空以获取通用指引。',
  },
  'divination.question.placeholder': {
    en: 'e.g., Should I make this career change?',
    zh: '例如：我应该换工作吗？',
  },
  'divination.cast': {
    en: 'Cast the Coins',
    zh: '投掷铜钱',
  },
  'divination.casting.text': {
    en: 'Casting the ancient coins...',
    zh: '正在投掷古老铜钱...',
  },
  'divination.casting.progress': {
    en: 'of 6 lines revealed',
    zh: '已揭示（共六爻）',
  },
  'divination.result.mainHex': {
    en: 'Main Hexagram',
    zh: '主卦',
  },
  'divination.result.changedHex': {
    en: 'Changed Hexagram',
    zh: '变卦',
  },
  'divination.result.yourQuestion': {
    en: 'Your Question',
    zh: '你的问题',
  },
  'divination.result.interpretation': {
    en: 'Interpretation',
    zh: '解卦',
  },
  'divination.result.castAgain': {
    en: 'Cast Again',
    zh: '再次占卜',
  },
  'divination.result.noQuestion': {
    en: 'General Guidance',
    zh: '通用指引',
  },

  // --- Disclaimer ---
  'disclaimer.text': {
    en: 'For Entertainment Purposes Only. This is not professional medical, psychological, or financial advice.',
    zh: '仅供娱乐参考。不构成专业医疗、心理或财务建议。',
  },

  // --- Language Switcher ---
  'lang.switch': {
    en: '中文',
    zh: 'English',
  },

  // --- Element Names ---
  'element.wood': {
    en: 'Wood',
    zh: '木',
  },
  'element.fire': {
    en: 'Fire',
    zh: '火',
  },
  'element.earth': {
    en: 'Earth',
    zh: '土',
  },
  'element.metal': {
    en: 'Metal',
    zh: '金',
  },
  'element.water': {
    en: 'Water',
    zh: '水',
  },

  // --- Archetype Names ---
  'archetype.wood': {
    en: 'The Growth Pioneer',
    zh: '成长先锋',
  },
  'archetype.fire': {
    en: 'The Radiant Inspirer',
    zh: '光芒启迪者',
  },
  'archetype.earth': {
    en: 'The Grounded Guardian',
    zh: '稳重守护者',
  },
  'archetype.metal': {
    en: 'The Strategic Architect',
    zh: '战略建筑师',
  },
  'archetype.water': {
    en: 'The Intuitive Explorer',
    zh: '直觉探索者',
  },

  // --- Polarity ---
  'polarity.yin': {
    en: 'Yin',
    zh: '阴',
  },
  'polarity.yang': {
    en: 'Yang',
    zh: '阳',
  },

  // --- Keywords (Element) ---
  'keywords.wood': {
    en: ['Vision', 'Vitality', 'Expansion'],
    zh: ['远见', '活力', '拓展'],
  },
  'keywords.fire': {
    en: ['Passion', 'Transformation', 'Clarity'],
    zh: ['热情', '蜕变', '明晰'],
  },
  'keywords.earth': {
    en: ['Stability', 'Nurturing', 'Reliability'],
    zh: ['稳定', '滋养', '可靠'],
  },
  'keywords.metal': {
    en: ['Precision', 'Discipline', 'Mastery'],
    zh: ['精准', '自律', '精通'],
  },
  'keywords.water': {
    en: ['Wisdom', 'Adaptability', 'Depth'],
    zh: ['智慧', '应变', '深度'],
  },
} as const;

export type TranslationKey = keyof typeof translations;

/**
 * 获取翻译文本
 * @param key 翻译键
 * @param locale 当前语言
 * @returns 翻译后的字符串或数组
 */
export function t<K extends TranslationKey>(
  key: K,
  locale: Locale
): (typeof translations)[K]['en'] {
  const entry = translations[key];
  if (!entry) {
    console.warn(`Missing translation key: ${key}`);
    return key as unknown as (typeof translations)[K]['en'];
  }
  return (entry[locale] ?? entry.en) as (typeof translations)[K]['en'];
}

/**
 * 类型安全的翻译辅助函数（用于动态键）
 */
export function tSafe(key: string, locale: Locale): string {
  const entry = (translations as Record<string, Record<Locale, unknown>>)[key];
  if (!entry) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }
  return (entry[locale] ?? entry.en) as string;
}

/**
 * 获取当前语言的显示名称
 */
export function getLocaleDisplayName(locale: Locale): string {
  return locale === 'en' ? 'English' : '中文';
}

/**
 * 获取另一语言
 */
export function getOtherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'zh' : 'en';
}
