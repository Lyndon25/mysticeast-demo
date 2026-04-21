/**
 * MysticEast V2 — 八章深度报告 Fallback 生成器
 * 当 LLM API 不可用时，基于命盘数据生成约三千字的结构化深度报告
 */

import { AIReport, BaziResult } from '@/types';

const elMap: Record<string, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };

function elZh(el: string): string { return elMap[el] || el; }
function strengthZh(s: string): string {
  return { strong: '身强', weak: '身弱', neutral: '中和' }[s] || s;
}

// ============ 辅助数据 ============

const elementImagery: Record<string, { zh: string; en: string }> = {
  wood: { zh: '参天古木，春生万物', en: 'a towering tree, springing forth all life' },
  fire: { zh: '离火之明，烛照幽微', en: 'the clarity of Li Fire, illuminating the obscure' },
  earth: { zh: '厚德载物，坤土为基', en: 'the earth bearing all, Kun as foundation' },
  metal: { zh: '金石为开，秋肃敛藏', en: 'metal cleaving stone, autumn gathering inward' },
  water: { zh: '上善若水，润下无声', en: 'the highest good like water, nurturing silently' },
};

const hiddenStemMap: Record<string, Record<string, string>> = {
  wood: {
    strong: '身强之木，枝叶繁茂，喜金斧修削以成栋梁，忌水泛木浮。',
    weak: '身弱之木，根浅叶疏，喜水润土培以固根基，忌金旺伐木。',
    neutral: '木气中和，生发有度，宜顺势而为，不可妄动。',
  },
  fire: {
    strong: '身强之火，烈焰燎原，喜土泄秀以成文明，忌木多火炽。',
    weak: '身弱之火，微光摇曳，喜木生扶以续薪传，忌水旺火熄。',
    neutral: '火气中和，光明不炽，宜守中道，以静制动。',
  },
  earth: {
    strong: '身强之土，厚重壅塞，喜木疏通以培生机，忌火多土焦。',
    weak: '身弱之土，薄瘠不毛，喜火生扶以暖土性，忌木旺土崩。',
    neutral: '土气中和，承载得宜，宜稳健行事，不急不躁。',
  },
  metal: {
    strong: '身强之金，刚锐易折，喜火炼金以成器皿，忌土多金埋。',
    weak: '身弱之金，柔脆不坚，喜土生扶以增刚健，忌火旺金熔。',
    neutral: '金气中和，刚柔并济，宜审时度势，进退有度。',
  },
  water: {
    strong: '身强之水，泛滥无归，喜木泄秀以成润泽，忌金多水浊。',
    weak: '身弱之水，涓滴将涸，喜金生扶以续源流，忌土旺水塞。',
    neutral: '水气中和，流动有节，宜随遇而安，不争不抢。',
  },
};

const organMap: Record<string, { zh: string; en: string }> = {
  wood: { zh: '肝胆', en: 'liver and gallbladder' },
  fire: { zh: '心小肠', en: 'heart and small intestine' },
  earth: { zh: '脾胃', en: 'spleen and stomach' },
  metal: { zh: '肺大肠', en: 'lungs and large intestine' },
  water: { zh: '肾膀胱', en: 'kidneys and bladder' },
};

const ganToEl: Record<string, string> = {
  甲: 'wood', 乙: 'wood', 丙: 'fire', 丁: 'fire', 戊: 'earth',
  己: 'earth', 庚: 'metal', 辛: 'metal', 壬: 'water', 癸: 'water',
};

function getGanEl(gan: string): string {
  return ganToEl[gan] || 'wood';
}

const practiceMap: Record<string, { zh: string; en: string }> = {
  wood: {
    zh: '于寅卯之时（清晨5-7点），面向东方站立，双手缓缓上举如托天，配合深长呼吸，观想自身如青松挺拔，根扎大地，枝接云天。每次修习十五至二十分钟，以激活肝经木气，疏解郁滞。',
    en: 'During the Yin-Mao hours (5-7 AM), stand facing east, slowly raise both hands as if lifting the sky, with deep breathing. Visualize yourself as a towering pine, roots deep in earth, branches touching clouds. Practice 15–20 minutes to activate Wood energy and release stagnation.',
  },
  fire: {
    zh: '于午时（正午11-13点），寻一安静处端坐，闭目观想心口有一团温暖明光，如烛火般稳定燃烧，不炽不弱。配合「呵」字诀呼气，每次七遍，以泄心火之有余，养心神之清明。',
    en: 'During the Wu hour (11 AM–1 PM), sit quietly, close your eyes and visualize a warm, steady light at your heart center, burning like a candle. Exhale with the "Ha" breath seven times to release excess Fire and nurture mental clarity.',
  },
  earth: {
    zh: '于辰戌丑未之时或餐后半小时，取坐姿，双手叠放于脐下丹田，观想自身如大地般厚重安稳，呼吸深沉缓慢，意念随每一次吸气沉入脚底涌泉穴。每次修习十至十五分钟，以培土固中。',
    en: 'During Earth hours or half an hour after meals, sit with hands over the lower dantian. Visualize yourself as steady as the earth, breathing deep and slow, directing awareness to the Yongquan point at the soles with each inhale. Practice 10–15 minutes to ground and center.',
  },
  metal: {
    zh: '于申酉之时（下午3-7点），择空气清新处，行「呬」字诀呼吸法：吸气时观想白色金气自鼻入肺，呼气时发「呬」声，观想浊气尽出。每次九遍，以润肺清肠，增强肃降之力。',
    en: 'During the Shen-You hours (3–7 PM), in fresh air, practice the "Si" breath: inhale visualizing white Metal qi entering the lungs; exhale making the "Si" sound, visualizing turbid qi leaving. Repeat nine times to nourish lungs and strengthen descending energy.',
  },
  water: {
    zh: '于亥子时（晚9-11点或11点-1点），睡前静坐，观想自身如深潭静水，万念俱寂。配合「吹」字诀，以耳能闻己之呼吸为度，渐入虚无。每次十五至三十分钟，以藏精聚气，涵养肾元。',
    en: 'During the Hai-Zi hours (9–11 PM or 11 PM–1 AM), sit quietly before sleep. Visualize yourself as deep, still water, all thoughts silenced. Practice the "Chui" breath, audible to your own ears, gradually entering emptiness. Practice 15–30 minutes to conserve essence and nurture kidney yuan.',
  },
};

const closingVerses: Record<string, { zh: string; en: string }> = {
  wood: {
    zh: '「岁寒，然后知松柏之后凋也。」木德含仁，生发不息。汝之命局如春日青阳，虽经风霜，终必参天。日修一善，年进一阶，十年树木，百年树人。此身虽微，道心可宏。',
    en: '"Only when the year grows cold do we see that pine and cypress are the last to shed." The virtue of Wood holds benevolence, generating without cease. Your chart is like spring sunlight — though winds may blow, you will tower in time. Cultivate one virtue daily, advance one step yearly. Though the body is small, the Dao heart can be vast.',
  },
  fire: {
    zh: '「天行健，君子以自强不息。」火德为礼，光明磊落。汝之命局如离宫明火，虽遇阴霾，终必复燃。勿以外境之明暗，易吾心灯之明暗。守一不移，灵光自照。',
    en: '"As heaven maintains vigor, the noble person strives tirelessly." The virtue of Fire is propriety, bright and open. Your chart is like the Li palace flame — though shadows may come, it will always rekindle. Do not let the outer world dim your inner lamp. Hold to one point unmoving, and spiritual light will shine of itself.',
  },
  earth: {
    zh: '「地势坤，君子以厚德载物。」土德主信，承载万物。汝之命局如中央戊己，四时轮转而己不动。君子之德，不在乎速成，在乎日进。守中抱一，方得始终。',
    en: '"As earth is receptive, the noble person bears all with deep virtue." The virtue of Earth is trustworthiness, bearing all things. Your chart is like the central Wu-Ji — seasons turn, yet it remains unmoved. Noble virtue is not in quick success but in daily progress. Hold to the center and embrace oneness; only then is the beginning and end complete.',
  },
  metal: {
    zh: '「金曰从革，君子以义制事。」金德主义，肃杀之中藏生生之机。汝之命局如秋霜宝剑，磨砺既久，锋芒自显。然刚极易折，当以柔济之。义以为质，礼以行之。',
    en: '"Metal is called yielding and changing; the noble person regulates affairs with righteousness." The virtue of Metal is righteousness; within its severity hides the seed of life. Your chart is like an autumn frost sword — long honed, its edge will show. Yet extreme rigidity breaks; soften it with flexibility. Let righteousness be the substance, and propriety guide its expression.',
  },
  water: {
    zh: '「上善若水，水善利万物而不争。」水德主智，润下不争。汝之命局如沧海尾闾，万川归之而弗盈。智者之德，非在于争，在于容。以不争为争，以无为为为，道在其中矣。',
    en: '"The highest good is like water; water benefits all things without contention." The virtue of Water is wisdom, nurturing below without striving. Your chart is like the ocean receiving all rivers, never full. The virtue of the wise is not in contention but in capacity. By non-contention, all is achieved; by non-action, all is done. The Dao is found therein.',
  },
};

// ============ 中文 Fallback ============

function buildZhFallback(bazi: BaziResult): AIReport {
  const {
    fourPillars, dayMaster, tenGods, elementBalance, strength,
    favorableElements, unfavorableElements, favorableGods, personalityArchetype,
  } = bazi;

  const el = dayMaster.element;
  const pol = dayMaster.polarity === 'yin' ? '阴' : '阳';
  const str = strengthZh(strength);
  const img = elementImagery[el].zh;
  const hidden = hiddenStemMap[el][strength];
  const organ = organMap[el].zh;
  const practice = practiceMap[el].zh;
  const verse = closingVerses[el].zh;

  const fp = fourPillars;
  const baziStr = `${fp.year.gan.gan}${fp.year.zhi.zhi} ${fp.month.gan.gan}${fp.month.zhi.zhi} ${fp.day.gan.gan}${fp.day.zhi.zhi} ${fp.hour.gan.gan}${fp.hour.zhi.zhi}`;

  // 五行旺衰数值文本
  const balanceText = `木${elementBalance.wood.toFixed(1)}、火${elementBalance.fire.toFixed(1)}、土${elementBalance.earth.toFixed(1)}、金${elementBalance.metal.toFixed(1)}、水${elementBalance.water.toFixed(1)}`;

  // 旺衰排序
  const sorted = Object.entries(elementBalance)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${elZh(k)}(${v.toFixed(1)})`)
    .join(' > ');

  // 喜用神文本
  const favText = favorableElements.map(elZh).join('、');
  const unfavText = unfavorableElements.map(elZh).join('、');

  // 藏干分析
  const hiddenAnalysis = [
    `年支${fp.year.zhi.zhi}藏${fp.year.zhi.hiddenGan.join('、')}，年柱十神为${tenGods.yearGan}、${tenGods.yearZhi}，暗示祖上根基与童年印记；`,
    `月支${fp.month.zhi.zhi}藏${fp.month.zhi.hiddenGan.join('、')}，月柱十神为${tenGods.monthGan}、${tenGods.monthZhi}，主导青年运势与心性底色；`,
    `日支${fp.day.zhi.zhi}藏${fp.day.zhi.hiddenGan.join('、')}，为夫妻宫与内心世界之映射；`,
    `时支${fp.hour.zhi.zhi}藏${fp.hour.zhi.hiddenGan.join('、')}，时柱十神为${tenGods.hourGan}、${tenGods.hourZhi}，关乎子女与晚年归宿。`,
  ].join('');

  // 藏干深层能量（日支藏干的五行）
  const dayHiddenEls = fp.day.zhi.hiddenGan.map(g => elZh(getGanEl(g))).join('、');

  // 困境诊断
  let dilemma = '';
  if (strength === 'strong') {
    dilemma = `${pol}${elZh(el)}日主身强，命局中比劫或印星偏旺，易形成「刚愎自用」之心性盲区。你习惯以力量开路，却可能忽视了他人的感受与环境的微妙信号。在事业中，你可能因过于自信而错失协作良机；在感情中，${favorableGods.includes('正官') || favorableGods.includes('七杀') ? '官杀透干虽赋予你领导力，却也让你在亲密关系中不自觉地扮演权威角色，给对方造成压迫。' : '喜用神不显，你可能在关系中要么过于主导，要么因不知如何表达而显得疏离。'}从业力模式观之，身强者常携「征服」之课题而来，此生之修行在于学会「放下」与「柔软」，将刚猛之气转化为护持之德。`;
  } else if (strength === 'weak') {
    dilemma = `${pol}${elZh(el)}日主身弱，命局中${unfavText}偏旺而${favText}不足，易形成「依附犹豫」之心性盲区。你敏感细腻，却也容易因外界评价而动摇本心。在事业中，你可能因缺乏自信而错失晋升机会，或在决策时过度依赖他人意见；在感情中，${favorableGods.includes('正印') || favorableGods.includes('偏印') ? '印星生身虽赋予你智慧与洞察力，却也让你在关系中倾向于默默付出而非主动争取，容易被视为「隐形人」。' : '财星克印，你可能在物质需求与自我价值之间反复摇摆，不知如何平衡。'}从业力模式观之，身弱者常携「信任」之课题而来，此生之修行在于建立内在根基，学会在柔软中蕴含坚定。`;
  } else {
    dilemma = `${pol}${elZh(el)}日主中和，五行能量分布相对均衡，这是难得的命格，却也带来「方向迷失」的潜在困境。正因没有明显的偏旺之气，你往往能感受到多种可能性，却难以锚定一个方向深入。在事业中，你可能多才多艺却缺乏专精；在感情中，你可能过于迁就对方而失去自我边界。从业力模式观之，中和之命常携「选择」之课题而来，此生之修行不在于找到唯一的正确答案，而在于培养「在不确定中安住」的心性定力。`;
  }

  // 行动方略
  const dirMap: Record<string, string> = { wood: '东方', fire: '南方', earth: '中央', metal: '西方', water: '北方' };
  const itemMap: Record<string, string> = {
    wood: '绿植或木质摆件', fire: '红色装饰或烛台', earth: '陶瓷或水晶',
    metal: '金属风铃或白色装饰', water: '水景或黑色饰品',
  };
  const careerMap: Record<string, string> = {
    wood: '教育、设计、园艺', fire: '演艺、营销、餐饮',
    earth: '建筑、医疗、农业', metal: '金融、法律、科技', water: '物流、旅游、咨询',
  };
  const colorMap: Record<string, string> = {
    wood: '青绿', fire: '朱红', earth: '黄褐', metal: '素白', water: '玄黑',
  };
  const zhiMap: Record<string, string> = { wood: '寅卯', fire: '巳午', earth: '辰戌丑未', metal: '申酉', water: '亥子' };

  const action1 = `于未来九十日内，择${zhiMap[favorableElements[0]]}月或${favText}能量较旺之日，在居室${dirMap[favorableElements[0]]}方位布置${favText}元素之物（如${itemMap[favorableElements[0]]}），并于该日启动一件与你长期目标相关的小事。验证标准：连续七日记录此事进展，观察心绪与机缘的变化。`;

  const action2 = `每日晨起后，以十分钟时间静观呼吸，配合${favText}元素之色（${colorMap[favorableElements[0]]}）为意念锚点，观想该能量自头顶百会穴灌入，沿脊柱下行至脚底。验证标准：连续二十一日不间断，记录每日观想后的身心感受，于第三周周末回顾整体能量状态的变化。`;

  const action3 = `在本月内，主动与一位五行属性为${favText}之人（或从事${careerMap[favorableElements[0]]}行业之人）进行一次深度对话，探讨你当前面临的核心抉择。验证标准：对话后三日内，以书面形式整理出三点新认知，并择其一在七日内付诸微行动。`;

  return {
    chapter1: `你的八字排盘为：${baziStr}。日主${dayMaster.gan}${fp.day.zhi.zhi}，${pol}${elZh(el)}之命，${personalityArchetype}。这一命格在六十甲子循环中占据独特的时空坐标——年柱${fp.year.gan.gan}${fp.year.zhi.zhi}承载祖上荫庇与先天禀赋，月柱${fp.month.gan.gan}${fp.month.zhi.zhi}锚定青年运势与心性底色，日柱${fp.day.gan.gan}${fp.day.zhi.zhi}为命主自身之映射，时柱${fp.hour.gan.gan}${fp.hour.zhi.zhi}关乎晚年归宿与子女缘分。

从整体气机观之，你的命局呈现出「${img}」的能量画像。日主${pol}${elZh(el)}${str}，月令${fp.month.zhi.zhi}属${elZh(fp.month.zhi.element)}，与日主形成${fp.month.zhi.element === el ? '比和' : (fp.month.zhi.element === 'wood' && el === 'fire') || (fp.month.zhi.element === 'fire' && el === 'earth') || (fp.month.zhi.element === 'earth' && el === 'metal') || (fp.month.zhi.element === 'metal' && el === 'water') || (fp.month.zhi.element === 'water' && el === 'wood') ? '相生' : '相克'}之势。${hidden}

以《滴天髓》之论观之，${elZh(el)}日主「${el === 'wood' ? '甲木参天，脱胎要火；乙木系甲，可春可秋' : el === 'fire' ? '丙火猛烈，欺霜侮雪；丁火柔中，内性昭融' : el === 'earth' ? '戊土固重，既中且正；己土卑湿，中正蓄藏' : el === 'metal' ? '庚金带煞，刚健为最；辛金柔和，温润而清' : '壬水通河，能泄金气；癸水至弱，达于天津'}」。你的命盘正是此一论法在当代语境下的独特显化。此洞察仅供娱乐和自我反思之用。`,

    chapter2: `深入命盘符号学解构，我们须逐柱精读以窥全貌。

${hiddenAnalysis}

从十神格局观之，你的月令十神为${tenGods.monthGan}，此为你命盘之「格局用神」。《子平真诠》云：「${tenGods.monthGan === '正官' ? '正官者，贵气之神，喜财印相辅，忌伤官混杂。' : tenGods.monthGan === '七杀' ? '七杀者，刚暴之神，喜食神制之，忌财星滋杀。' : tenGods.monthGan === '正印' ? '正印者，仁厚之神，喜官星生之，忌财星破印。' : tenGods.monthGan === '偏印' ? '偏印者，灵秀之神，喜偏财制之，忌食神泄气。' : tenGods.monthGan === '比肩' ? '比肩者，助我之神，喜官星制之，忌财星夺食。' : tenGods.monthGan === '劫财' ? '劫财者，争财之神，喜官星制之，忌印星生扶。' : tenGods.monthGan === '食神' ? '食神者，秀气之神，喜财星泄之，忌印星夺食。' : tenGods.monthGan === '伤官' ? '伤官者，傲气之神，喜财星泄之，忌官星相见。' : tenGods.monthGan === '正财' ? '正财者，勤恳之神，喜官星护之，忌比劫夺财。' : '偏财者，慷慨之神，喜食神生之，忌比劫分夺。'}」你的命盘中${favorableGods.join('、')}为喜用，${favorableGods.length >= 2 ? '这种组合赋予你独特的天赋架构——既能' + (favorableGods.includes('正官') ? '在社会规范中游刃有余' : favorableGods.includes('七杀') ? '在竞争中脱颖而出' : favorableGods.includes('正印') ? '在知识积累中日益深厚' : favorableGods.includes('偏印') ? '在灵性探索中独具慧眼' : favorableGods.includes('食神') ? '在创意表达中自成一格' : favorableGods.includes('伤官') ? '在突破常规中开辟新路' : favorableGods.includes('正财') ? '在务实耕耘中稳步积累' : '在资源整合中长袖善舞') + '，又能在' + (favorableGods.includes('正印') || favorableGods.includes('偏印') ? '内在世界' : '外在世界') + '中找到深层意义。' : '这种单一的用神格局意味着你的天赋能量集中于一处，如激光之聚焦，虽无广泛之覆盖，却有穿透之深度。'}

从藏干暗局观之，${fp.day.zhi.zhi}中藏${fp.day.zhi.hiddenGan.join('、')}，此为你的「内心世界」——外在展现的${dayMaster.gan}之下，潜藏着${dayHiddenEls}的深层能量。这种表里之间的张力，构成了你性格中最富魅力也最复杂的维度。此洞察仅供娱乐和自我反思之用。`,

    chapter3: `五行生克是命理推演的核心算法。你的命盘中，五行能量分布如下：${balanceText}。按旺衰排序为：${sorted}。

从生克流变观之，${elementBalance[el] >= 2.5 ? `你的日主${elZh(el)}气偏旺，如${el === 'wood' ? '春林之木' : el === 'fire' ? '夏炉之火' : el === 'earth' ? '长夏之土' : el === 'metal' ? '秋霜之金' : '冬海之水'}，能量充沛却也容易壅塞。` : elementBalance[el] <= 1.5 ? `你的日主${elZh(el)}气偏弱，如${el === 'wood' ? '秋末之木' : el === 'fire' ? '冬夜之火' : el === 'earth' ? '初春之土' : el === 'metal' ? '夏炉之金' : '长夏之水'}，需要生扶方能焕发生机。` : `你的日主${elZh(el)}气中和，如${el === 'wood' ? '四季常青之木' : el === 'fire' ? '烛照书案之火' : el === 'earth' ? '庭院之土' : el === 'metal' ? '案头之器' : '溪涧之水'}，虽不显赫却也从容。`}${favorableElements.length > 0 ? `喜用神${favText}为你命局之「补药」，在日常生活中培养这些元素的能量，可起到调和命局、增益运势之效。` : ''}${unfavorableElements.length > 0 ? `忌仇神${unfavText}为你命局之「毒素」，宜适度远离而非强行对抗。` : ''}

从脏腑对应关系推演，${elZh(el)}主${organ}。${elementBalance[el] > 3 ? `你的${organ}系统能量偏亢，需注意疏导与平衡，避免因过度耗用而导致虚火或实热之症。` : elementBalance[el] < 1 ? `你的${organ}系统能量偏弱，需注重滋养与呵护，通过饮食、作息与情志调摄来培补元气。` : `你的${organ}系统能量适中，保持现有生活节奏即可，不必刻意增减。`}${elementBalance.water < 1 && el !== 'water' ? '命局水弱，肾水不足，易有精力不济或睡眠不安之象，宜早眠养肾。' : ''}${elementBalance.wood < 1 && el !== 'wood' ? '命局木弱，肝气不舒，易有郁结或决策犹豫之倾向，宜踏青疏肝。' : ''}${elementBalance.fire < 1 && el !== 'fire' ? '命局火弱，心气不足，易有动力匮乏或社交退缩之象，宜晒太阳养心安神。' : ''}${elementBalance.earth < 1 && el !== 'earth' ? '命局土弱，脾胃不健，易有思虑过度或消化吸收不良之倾向，宜饮食规律、少食生冷。' : ''}${elementBalance.metal < 1 && el !== 'metal' ? '命局金弱，肺气不宣，易有呼吸系统敏感或决断力不足之象，宜深呼吸锻炼肺活量。' : ''}

从${str}格局的能量特征观之，${hidden}此洞察仅供娱乐和自我反思之用。`,

    chapter4: `大运推演须以日主为核心，结合流年流月之干支与命盘的刑冲合害关系进行综合分析。

你当前所处的大运周期中，天干地支与命盘的互动呈现出特定的能量主题。以日主${elZh(el)}为基准，${favorableElements.length > 0 ? `当大运或流年出现${favText}时，为你的「能量共振期」——此时机遇增多、贵人相助、事半功倍。` : '当大运与命局形成和谐之势时，为你的「能量共振期」。'}${unfavorableElements.length > 0 ? `当大运或流年出现${unfavText}时，为你的「能量挑战期」——此时阻力增大、变动频繁，宜守不宜攻。` : '当大运与命局形成冲克之势时，为你的「能量挑战期」。'}

未来九十日内，关键能量窗口如下：

第一窗口（约未来30天内）：${favorableElements[0] ? `${favText}能量渐盛之期。此阶段适合启动与${favText}相关的事务，如${favorableElements[0] === 'wood' ? '学习新技能、制定年度计划' : favorableElements[0] === 'fire' ? '展示自我、推进创意项目' : favorableElements[0] === 'earth' ? '巩固关系、处理房产或家庭事务' : favorableElements[0] === 'metal' ? '财务规划、法律事务、技能精进' : '深度思考、战略规划、冥想修行'}。` : '能量趋于平稳，适合整理与回顾。'}

第二窗口（约未来30-60天）：${favorableElements[1] || favorableElements[0] ? `${favText}与命局形成${strength === 'strong' ? '泄秀' : '生扶'}之势。此阶段${strength === 'strong' ? '你的才华与能力将得到充分展现，适合承担更具挑战性的任务。' : '你将获得外部支持与资源，适合寻求帮助或建立合作关系。'}` : '需注意地支之间的潜在刑冲，避免重大决策。'}

第三窗口（约未来60-90天）：流年丙午之火与日主${elZh(el)}形成${el === 'fire' ? '火上加火、能量放大' : el === 'wood' ? '木生火、火泄木' : el === 'earth' ? '火生土、土得助' : el === 'metal' ? '火克金、金受炼' : '水克火、水火既济'}之势。${el === 'fire' ? '火上加火，能量放大，宜注意节制与平衡，避免过度消耗。' : el === 'wood' ? '火泄木气，你的创意与精力将得到释放，适合表达与输出。' : el === 'earth' ? '火生土旺，你的稳定性与承载力增强，适合建立长期规划。' : el === 'metal' ? '火炼真金，此阶段虽有压力，却是成器之机，宜迎难而上。' : '水火既济，阴阳调和，此阶段思维清晰、直觉敏锐，适合重要决策。'}

需留意的转折期：地支相冲之月（如${fp.year.zhi.zhi}与流年地支形成冲克时），易有突发变动或情绪波动，宜提前规划、保持弹性。此洞察仅供娱乐和自我反思之用。`,

    chapter5: `${dilemma}

《周易·系辞》有云：「${el === 'wood' ? '穷理尽性，以至于命。' : el === 'fire' ? '二人同心，其利断金。' : el === 'earth' ? '安土敦乎仁，故能爱。' : el === 'metal' ? '乾以易知，坤以简能。' : '天下同归而殊途，一致而百虑。'}」你的命盘之困，非外在环境之困，而是内在能量配置之困。${strength === 'strong' ? '身强之命，困在「过刚」；须知柔能克刚，水能穿石。' : strength === 'weak' ? '身弱之命，困在「过柔」；须知积柔成刚，滴水穿石。' : '中和之命，困在「不定」；须知执一而万毕，守中而道全。'}

从现世境遇三维度交叉剖析：

**事业维度**：${tenGods.monthGan === '正官' || tenGods.monthGan === '七杀' ? '你的官杀透干，事业心强、目标明确，但也容易将自我价值过度绑定于社会成就与职位高低。当外部环境不顺时，这种绑定会让你陷入深度焦虑。建议将「做事」与「做人」分开，事业是修行之场，而非全部。' : tenGods.monthGan === '正财' || tenGods.monthGan === '偏财' ? '你的财星当令，对物质安全与资源积累有天然敏感，但也容易在「足够」与「更多」之间迷失。须知命理之财非仅指金钱，更指你所能创造的价值与影响。' : tenGods.monthGan === '食神' || tenGods.monthGan === '伤官' ? '你的食伤吐秀，创意丰富、表达欲强，但也容易因想法过多而行动分散，或因追求完美而拖延不决。建议选定一个方向深耕，将才华转化为可交付的成果。' : '你的印星生身，学习力强、内省深刻，但也容易因过度思考而行动迟缓，或因依赖知识而忽视实践。建议将「知道」转化为「做到」，在实践中检验真理。'}

**关系维度**：${pol === '阴' ? '你属阴性能量，在感情中倾向于内在感知与深度联结。你的挑战在于如何在保持自我边界的同时向他人敞开。' : '你属阳性能量，在感情中倾向于主动表达与积极争取。你的挑战在于如何在追求目标的同时尊重他人的节奏与需求。'}${favorableGods.includes('正财') || favorableGods.includes('偏财') ? '财星为用，你在关系中重视实际付出与物质保障，但也需留意是否以「给予」替代了「陪伴」。' : favorableGods.includes('正官') || favorableGods.includes('七杀') ? '官杀为用，你在关系中重视责任与承诺，但也需留意是否以「规则」替代了「温情」。' : favorableGods.includes('食神') || favorableGods.includes('伤官') ? '食伤为用，你在关系中重视思想交流与精神共鸣，但也需留意是否以「对话」替代了「倾听」。' : '印星为用，你在关系中重视理解与支持，但也需留意是否以「关怀」替代了「平等」。'}

**健康维度**：你的${organ}系统为命局之核心脏腑。${strength === 'strong' ? '身强之体，气血偏旺，需注意疏导而非补益。运动宜选择太极、瑜伽等柔和方式，不宜过度剧烈。' : strength === 'weak' ? '身弱之体，气血偏虚，需注意滋养而非消耗。作息宜早睡早起，饮食宜温补忌寒凉。' : '中和之体，气血调匀，保持规律作息即可，无需刻意调整。'}此洞察仅供娱乐和自我反思之用。`,

    chapter6: `禅修实修是转化命局的根本途径。《黄帝内经》云：「恬淡虚无，真气从之；精神内守，病安从来。」以下方案根据你的${elZh(el)}命、${str}格局、喜用神${favText}量身定制。

**晨间修习（05:00–07:00 或日出前后）**：
${practice}

**午间调摄（11:00–13:00 或午休时段）**：
于午饭前静坐五分钟，以「数息法」安定心神：吸气时默念「一」，呼气时默念「松」，循环十次。此法可清${organ}之虚火，养脾胃之中气，令午后工作精力充沛而不浮躁。

**晚间收功（21:00–23:00 或睡前）**：
${strength === 'strong' ? '身强之体，晚间宜「降」不宜「升」。可于睡前以温水泡脚十五至二十分钟，同时按摩涌泉穴（脚底前三分之一凹陷处），意念随水温下沉，观想日间亢奋之气自足底排出，归入大地。' : strength === 'weak' ? '身弱之体，晚间宜「养」不宜「耗」。可于睡前以掌心搓热后温敷丹田（脐下三寸），配合「吸气提会阴、呼气松全身」的呼吸法，每次九遍，以培补元气、固护根本。' : '中和之体，晚间宜「平」不宜「偏」。可于睡前以散步或轻柔拉伸放松身心，随后以「观呼吸」法入睡：将注意力轻轻放在鼻端呼吸的出入上，不控制、不追随，如旁观者般静观，自然渐入梦乡。'}

**意念锚点与观想口诀**：
你的日常观想对象为${el === 'wood' ? '「一棵参天古木，根深叶茂，春生夏长，秋收冬藏，四季轮转而树常在」' : el === 'fire' ? '「一盏长明灯，火焰稳定，不随风摇曳，不为油尽而忧，光明自照，亦照他人」' : el === 'earth' ? '「一片广袤大地，承载山川河流，不拒细流，不择草木，万物生长而不自居其功」' : el === 'metal' ? '「一块璞玉，未经雕琢而内含温润，经火炼、经刀刻，终成器皿，却未曾失去本质」' : '「一潭深水，表面平静无波，深处暗流涌动，纳百川而不争，处低位而润万物」'}。当情绪波动或决策犹豫时，闭目观想此意象三十秒，可迅速回归内在中心。

**特殊时节调整**：
每逢${el === 'wood' ? '立春、惊蛰、清明' : el === 'fire' ? '立夏、夏至、大暑' : el === 'earth' ? '立春后十八日、长夏、四季末' : el === 'metal' ? '立秋、白露、霜降' : '立冬、冬至、大寒'}等节气，你的${elZh(el)}能量将经历显著波动。建议在这些节气前后三日增加静坐时间至三十分钟，并以${favText}元素之物（如${favorableElements[0] === 'wood' ? '绿植精油' : favorableElements[0] === 'fire' ? '红色烛光' : favorableElements[0] === 'earth' ? '黄色水晶' : favorableElements[0] === 'metal' ? '金属风铃' : '蓝色水景'}）布置修行空间，以增强与天地节律的共振。此洞察仅供娱乐和自我反思之用。`,

    chapter7: `行动方略须具体、可验证、可量化。以下三条按优先级排列，建议你择一而行，深入实践。

**第一优先：能量场域布置（时间框架：未来7日内启动，持续21日）**
${action1}

**第二优先：每日心法修习（时间框架：明日启动，持续21日）**
${action2}

**第三优先：贵人连结与信息获取（时间框架：本月内完成）**
${action3}

以上三条方略均与你的命盘数据直接关联，非泛泛而谈。命理之学，贵在「知命者不立于岩墙之下」，更贵在「造命者能转祸为福」。行动是转化的唯一途径，观想与规划若不与实践结合，终将沦为空中楼阁。建议你以二十一日为一个周期，选定一条方略深入执行，期满后再回顾评估，调整下一步方向。此洞察仅供娱乐和自我反思之用。`,

    chapter8: `${verse}

**每日心法口诀**：
${el === 'wood' ? '「木德含仁，生发不息；日拱一卒，终必参天。」每日晨起默诵三遍，观想自身如幼苗破土，虽微而韧。' : el === 'fire' ? '「火德为礼，光明内照；守一不移，灵光自耀。」每日晨起默诵三遍，观想心口明光温暖稳定。' : el === 'earth' ? '「土德主信，厚德载物；守中抱一，方得始终。」每日晨起默诵三遍，观想自身如大地沉稳安详。' : el === 'metal' ? '「金德主义，从革有节；刚柔相济，道在其中。」每日晨起默诵三遍，观想自身如金石内外明澈。' : '「水德主智，润下不争；以柔克刚，道自恒常。」每日晨起默诵三遍，观想自身如深潭静水流深。'}

命盘如地图，指引方向却不代你行走；运势如天气，影响行程却不决定终点。你是自己命运的作者，命理只是助你读懂稿纸上的墨迹。愿你在东方智慧的滋养中，找到属于自己的道。此洞察仅供娱乐和自我反思之用。`,
  };
}

// ============ 英文 Fallback ============

function buildEnFallback(bazi: BaziResult): AIReport {
  const {
    fourPillars, dayMaster, tenGods, elementBalance, strength,
    favorableElements, unfavorableElements, favorableGods, personalityArchetype,
  } = bazi;

  const el = dayMaster.element;
  const pol = dayMaster.polarity === 'yin' ? 'Yin' : 'Yang';
  const str = strength;
  const img = elementImagery[el].en;
  const hiddenRaw = hiddenStemMap[el][strength];
  // Simple translation for hidden stem map in English fallback
  const hidden = hiddenRaw
    .replace(/身强/g, 'strong').replace(/身弱/g, 'weak').replace(/中和/g, 'balanced')
    .replace(/之木/g, ' Wood').replace(/之火/g, ' Fire').replace(/之土/g, ' Earth')
    .replace(/之金/g, ' Metal').replace(/之水/g, ' Water')
    .replace(/木/g, 'Wood').replace(/火/g, 'Fire').replace(/土/g, 'Earth')
    .replace(/金/g, 'Metal').replace(/水/g, 'Water').replace(/喜/g, 'favors ').replace(/忌/g, 'avoids ');
  const organ = organMap[el].en;
  const practice = practiceMap[el].en;
  const verse = closingVerses[el].en;

  const fp = fourPillars;
  const baziStr = `${fp.year.gan.gan}${fp.year.zhi.zhi} ${fp.month.gan.gan}${fp.month.zhi.zhi} ${fp.day.gan.gan}${fp.day.zhi.zhi} ${fp.hour.gan.gan}${fp.hour.zhi.zhi}`;

  const balanceText = `Wood ${elementBalance.wood.toFixed(1)}, Fire ${elementBalance.fire.toFixed(1)}, Earth ${elementBalance.earth.toFixed(1)}, Metal ${elementBalance.metal.toFixed(1)}, Water ${elementBalance.water.toFixed(1)}`;

  const sorted = Object.entries(elementBalance)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} (${v.toFixed(1)})`)
    .join(' > ');

  const favText = favorableElements.join(', ');
  const unfavText = unfavorableElements.join(', ');

  const hiddenAnalysis = [
    `The Year branch ${fp.year.zhi.zhi} conceals ${fp.year.zhi.hiddenGan.join(', ')}, with Year Pillar Ten Gods ${tenGods.yearGan} and ${tenGods.yearZhi}, indicating ancestral roots and childhood imprinting. `,
    `The Month branch ${fp.month.zhi.zhi} conceals ${fp.month.zhi.hiddenGan.join(', ')}, with Month Pillar Ten Gods ${tenGods.monthGan} and ${tenGods.monthZhi}, governing youth fortune and psychological foundation. `,
    `The Day branch ${fp.day.zhi.zhi} conceals ${fp.day.zhi.hiddenGan.join(', ')}, representing the marital palace and inner world. `,
    `The Hour branch ${fp.hour.zhi.zhi} conceals ${fp.hour.zhi.hiddenGan.join(', ')}, with Hour Pillar Ten Gods ${tenGods.hourGan} and ${tenGods.hourZhi}, relating to offspring and later-life destiny.`,
  ].join('');

  let dilemma = '';
  if (strength === 'strong') {
    dilemma = `As a ${pol} ${el} Day Master with strong energy, your chart shows an abundance of Companion or Resource elements, which may create a cognitive blind spot of overconfidence. You tend to charge forward with force, potentially overlooking subtle signals from others and the environment. In career, this may cause you to miss collaborative opportunities due to excessive self-assurance. In relationships, ${favorableGods.includes('正官') || favorableGods.includes('七杀') ? 'your Officer gods grant leadership, yet you may unconsciously adopt an authoritative role with partners, creating pressure.' : 'with favorable gods not prominently displayed, you may either dominate or appear distant due to uncertainty about emotional expression.'} From a karmic perspective, strong charts often carry the lesson of "conquest" — this lifetime's cultivation lies in learning to let go and soften, transforming aggressive energy into protective virtue.`;
  } else if (strength === 'weak') {
    dilemma = `As a ${pol} ${el} Day Master with weak energy, your chart shows ${unfavText} elements prevailing while ${favText} elements are insufficient, creating a tendency toward hesitation and dependency. You are sensitive and perceptive, yet easily swayed by external opinions. In career, you may miss promotions due to lack of confidence or over-reliance on others' input. In relationships, ${favorableGods.includes('正印') || favorableGods.includes('偏印') ? 'your Resource gods grant wisdom, yet you tend to give silently rather than actively seek what you need, potentially becoming invisible.' : 'with Wealth clashing Resource, you may oscillate between material needs and self-worth, uncertain how to balance them.'} From a karmic perspective, weak charts often carry the lesson of "trust" — this lifetime's cultivation lies in building an inner foundation, learning to be firm within softness.`;
  } else {
    dilemma = `As a ${pol} ${el} Day Master with balanced energy, your five-element distribution is relatively even — a rare configuration, yet one that carries the potential challenge of "directional drift." Precisely because no element dominates, you sense many possibilities yet struggle to anchor deeply in one direction. In career, you may be versatile yet lack specialization. In relationships, you may accommodate others excessively, losing boundaries. From a karmic perspective, balanced charts often carry the lesson of "choice" — this lifetime's cultivation is not about finding the single right answer, but about developing the meditative capacity to dwell peacefully in uncertainty.`;
  }

  const dirMap: Record<string, string> = { wood: 'east', fire: 'south', earth: 'center', metal: 'west', water: 'north' };
  const itemMap: Record<string, string> = {
    wood: 'green plants or wooden ornaments', fire: 'red decor or candles', earth: 'ceramics or crystals',
    metal: 'metal wind chimes or white decor', water: 'water features or dark-colored ornaments',
  };
  const careerMap: Record<string, string> = {
    wood: 'education, design, or gardening', fire: 'performing arts, marketing, or hospitality',
    earth: 'construction, healthcare, or agriculture', metal: 'finance, law, or technology', water: 'logistics, travel, or consulting',
  };
  const colorMap: Record<string, string> = {
    wood: 'green', fire: 'red', earth: 'yellow-brown', metal: 'white', water: 'deep blue',
  };

  const action1 = `Within the next ninety days, select a day when ${favorableElements[0]} energy is strong and place a ${favorableElements[0]}-element object (such as ${itemMap[favorableElements[0]]}) in the ${dirMap[favorableElements[0]]} direction of your living space. On that day, initiate one small action aligned with a long-term goal. Validation criterion: record progress for seven consecutive days, observing changes in mood and opportunities.`;

  const action2 = `Each morning after waking, spend ten minutes observing your breath, using the ${favorableElements[0]} color (${colorMap[favorableElements[0]]}) as a mental anchor. Visualize this energy entering through the crown and descending along the spine to the soles. Validation criterion: practice for twenty-one consecutive days without interruption, recording daily sensations, and review overall energy state at the end of week three.`;

  const action3 = `This month, intentionally engage in one deep conversation with someone whose elemental nature aligns with ${favText} (or who works in ${careerMap[favorableElements[0]]}), discussing a core dilemma you currently face. Validation criterion: within three days after the conversation, write down three new insights gained, and choose one to implement as a micro-action within seven days.`;

  return {
    chapter1: `Your Four Pillars birth chart is: ${baziStr}. The Day Master is ${dayMaster.gan}${fp.day.zhi.zhi}, a ${pol} ${el} person — ${personalityArchetype}. This chart occupies a unique spatiotemporal coordinate within the 60-Jiazi cycle. The Year Pillar ${fp.year.gan.gan}${fp.year.zhi.zhi} carries ancestral legacy and innate endowment. The Month Pillar ${fp.month.gan.gan}${fp.month.zhi.zhi} anchors youth fortune and psychological temperament. The Day Pillar ${fp.day.gan.gan}${fp.day.zhi.zhi} reflects the self. The Hour Pillar ${fp.hour.gan.gan}${fp.hour.zhi.zhi} relates to offspring and later-life destiny.

From the perspective of overall qi pattern, your chart presents an energetic portrait of "${img}." The Day Master is ${pol} ${el} with ${str} energy; the month branch ${fp.month.zhi.zhi} belongs to ${fp.month.zhi.element}, forming a ${fp.month.zhi.element === el ? 'harmonious' : (fp.month.zhi.element === 'wood' && el === 'fire') || (fp.month.zhi.element === 'fire' && el === 'earth') || (fp.month.zhi.element === 'earth' && el === 'metal') || (fp.month.zhi.element === 'metal' && el === 'water') || (fp.month.zhi.element === 'water' && el === 'wood') ? 'generating' : 'controlling'} relationship with the Day Master. ${hidden}

From the classical text Di Tian Sui: "${el === 'wood' ? 'Jia Wood reaches to heaven; to be transformed it needs Fire. Yi Wood clings to Jia; it flourishes in spring and autumn alike.' : el === 'fire' ? 'Bing Fire is fierce, defying frost and snow. Ding Fire is soft within, its nature bright and melting.' : el === 'earth' ? 'Wu Earth is solid and heavy, centered and upright. Ji Earth is low and moist, storing and concealing.' : el === 'metal' ? 'Geng Metal carries severity; its greatest quality is firmness. Xin Metal is gentle, moist and clear.' : 'Ren Water connects to rivers, able to discharge Metal qi. Gui Water is the weakest, reaching to the celestial ford.'}" Your chart is the unique contemporary manifestation of this classical principle. This insight is for entertainment and self-reflection purposes only.`,

    chapter2: `A semiotic deconstruction of the chart requires careful reading of each pillar.

${hiddenAnalysis}

From the perspective of Ten God framework, your month command Ten God is ${tenGods.monthGan}, which serves as the "pattern useful god." As Zi Ping Zhen Quan states: "${tenGods.monthGan === '正官' ? 'The Direct Officer is the god of nobility; it favors Wealth and Resource supporting it, and avoids Hurting Officer mixing in.' : tenGods.monthGan === '七杀' ? 'The Challenge God is fierce; it favors Output controlling it, and avoids Wealth nourishing it.' : tenGods.monthGan === '正印' ? 'The Direct Resource is benevolent; it favors Officer generating it, and avoids Wealth breaking it.' : tenGods.monthGan === '偏印' ? 'The Unconventional Resource is spiritually gifted; it favors Indirect Wealth controlling it, and avoids Output draining qi.' : tenGods.monthGan === '比肩' ? 'The Companion assists the self; it favors Officer controlling it, and avoids Wealth seizing food.' : tenGods.monthGan === '劫财' ? 'The Competitor contends for wealth; it favors Officer controlling it, and avoids Resource nourishing it.' : tenGods.monthGan === '食神' ? 'The Output God is elegant; it favors Wealth draining it, and avoids Resource seizing food.' : tenGods.monthGan === '伤官' ? 'The Hurting Officer is proud; it favors Wealth draining it, and avoids Officer appearing.' : tenGods.monthGan === '正财' ? 'The Direct Wealth is diligent; it favors Officer protecting it, and avoids Companion seizing wealth.' : 'The Indirect Wealth is generous; it favors Output generating it, and avoids Companion dividing it.'}" In your chart, ${favorableGods.join(', ')} are favorable, ${favorableGods.length >= 2 ? 'creating a unique talent architecture that allows you to both navigate social structures and find deeper meaning.' : 'indicating concentrated talent energy — like a laser beam, less broad but deeply penetrating.'}

From the hidden stems perspective, the Day branch ${fp.day.zhi.zhi} conceals ${fp.day.zhi.hiddenGan.join(', ')}, representing your "inner world." Beneath the visible ${dayMaster.gan} surface lies latent energy. This tension between appearance and depth forms the most compelling yet complex dimension of your character. This insight is for entertainment and self-reflection purposes only.`,

    chapter3: `The Five-Element dynamics are the core algorithm of destiny analysis. Your chart shows: ${balanceText}. Sorted by abundance: ${sorted}.

From the perspective of generating and controlling cycles, ${elementBalance[el] >= 2.5 ? `your Day Master ${el} qi is abundant, like ${el === 'wood' ? 'spring forest wood' : el === 'fire' ? 'summer furnace fire' : el === 'earth' ? 'late summer earth' : el === 'metal' ? 'autumn frost metal' : 'winter ocean water'} — energetic yet prone to congestion.` : elementBalance[el] <= 1.5 ? `your Day Master ${el} qi is deficient, like ${el === 'wood' ? 'late autumn wood' : el === 'fire' ? 'winter night fire' : el === 'earth' ? 'early spring earth' : el === 'metal' ? 'summer furnace metal' : 'late summer water'} — needing support to thrive.` : `your Day Master ${el} qi is balanced, like ${el === 'wood' ? 'evergreen wood through all seasons' : el === 'fire' ? 'candle illuminating a desk' : el === 'earth' ? 'courtyard earth' : el === 'metal' ? 'desk ornament metal' : 'mountain stream water'} — not outstanding yet composed.`}${favorableElements.length > 0 ? ` Favorable elements (${favText}) serve as the "medicine" for your chart; cultivating them in daily life helps harmonize destiny and enhance fortune.` : ''}${unfavorableElements.length > 0 ? ` Unfavorable elements (${unfavText}) are the "toxins"; it is better to moderately distance from them than to forcefully confront.` : ''}

Corresponding to organ systems, ${el} governs the ${organ}. ${elementBalance[el] > 3 ? `Your ${organ} system is energetically excessive; focus on drainage and balance, avoiding overuse that may lead to excess heat conditions.` : elementBalance[el] < 1 ? `Your ${organ} system is energetically deficient; focus on nourishment and care through diet, rest, and emotional regulation.` : `Your ${organ} system is moderately balanced; maintain current lifestyle without deliberate modification.`}${elementBalance.water < 1 && el !== 'water' ? ' With weak Water, kidney qi may be insufficient, potentially leading to low vitality or restless sleep; prioritize early bedtime to nourish kidneys.' : ''}${elementBalance.wood < 1 && el !== 'wood' ? ' With weak Wood, liver qi may be constrained, potentially leading to stagnation or indecision; spend time in nature to soothe the liver.' : ''}${elementBalance.fire < 1 && el !== 'fire' ? ' With weak Fire, heart qi may be deficient, potentially leading to low motivation or social withdrawal; get sunlight to nourish heart and calm spirit.' : ''}${elementBalance.earth < 1 && el !== 'earth' ? ' With weak Earth, spleen-stomach may be weak, potentially leading to overthinking or poor digestion; maintain regular meals and avoid cold foods.' : ''}${elementBalance.metal < 1 && el !== 'metal' ? ' With weak Metal, lung qi may not properly disseminate, potentially leading to respiratory sensitivity or indecisiveness; practice deep breathing exercises.' : ''}

The energetic signature of a ${str} chart: ${hidden} This insight is for entertainment and self-reflection purposes only.`,

    chapter4: `Major cycle projection requires analyzing the interaction between current luck cycle stems/branches and the natal chart's punishment, clash, harmony, and destruction relationships.

In your current major luck cycle, the heavenly stems and earthly branches interact with the natal chart to produce specific energetic themes. Using ${el} Day Master as reference, ${favorableElements.length > 0 ? `when the major cycle or annual cycle presents ${favText}, this is your "energy resonance period" — opportunities multiply, benefactors appear, and efforts yield double results.` : 'when the major cycle harmonizes with the natal chart, this is your energy resonance period.'}${unfavorableElements.length > 0 ? `When ${unfavText} appear, this is your "energy challenge period" — resistance increases, changes are frequent; it is better to defend than attack.` : 'When clashes arise, this is your energy challenge period.'}

Within the next ninety days, key energy windows are:

**First window** (approximately next 30 days): ${favorableElements[0] ? `${favText} energy gradually strengthens. This phase is suitable for initiating ${favorableElements[0]}-related matters such as ${favorableElements[0] === 'wood' ? 'learning new skills or annual planning' : favorableElements[0] === 'fire' ? 'self-expression or creative projects' : favorableElements[0] === 'earth' ? 'consolidating relationships or property matters' : favorableElements[0] === 'metal' ? 'financial planning or skill refinement' : 'deep thinking or strategic meditation'}.` : 'Energy is stable; suitable for review and consolidation.'}

**Second window** (approximately days 30–60): ${favorableElements[1] || favorableElements[0] ? `${favText} and the natal chart form a ${strength === 'strong' ? 'draining and expressing' : 'generating and supporting'} relationship. During this phase, ${strength === 'strong' ? 'your talents will be fully displayed; suitable for taking on more challenging tasks.' : 'you will receive external support and resources; suitable for seeking help or building partnerships.'}` : 'Be mindful of potential branch clashes; avoid major decisions.'}

**Third window** (approximately days 60–90): The 2026 Bing-Wu (strong Fire) year interacts with your ${el} Day Master to form a ${el === 'fire' ? 'harmonious amplification' : el === 'wood' ? 'Wood generating Fire, Fire draining Wood' : el === 'earth' ? 'Fire generating Earth, Earth being supported' : el === 'metal' ? 'Fire restraining Metal, Metal being forged' : 'Water restraining Fire, achieving Water-Fire balance'} relationship. ${el === 'fire' ? 'Fire upon fire amplifies energy; practice moderation to avoid burnout.' : el === 'wood' ? 'Fire drains Wood qi; your creativity will be released — suitable for expression and output.' : el === 'earth' ? 'Fire generates abundant Earth; your stability increases — suitable for long-term planning.' : el === 'metal' ? 'Fire forges true Metal; though pressured, this is the opportunity to become useful — face challenges bravely.' : 'Water and Fire achieve balance; your thinking will be clear and intuition sharp — suitable for important decisions.'}

Be mindful of turning-point periods when branch clashes occur (such as when the annual branch clashes with ${fp.year.zhi.zhi}); sudden changes or emotional fluctuations may arise. Plan ahead and maintain flexibility. This insight is for entertainment and self-reflection purposes only.`,

    chapter5: `${dilemma}

The I Ching says: "${el === 'wood' ? 'Investigate principles to the utmost, fully realize nature, and thereby reach destiny.' : el === 'fire' ? 'When two people are of one mind, their strength can cut through metal.' : el === 'earth' ? 'Being settled in the earth, one becomes rich in humanity and thus able to love.' : el === 'metal' ? 'The Creative is known through ease; the Receptive accomplishes through simplicity.' : 'All under heaven return to the same destination by different paths; one purpose gives rise to a hundred considerations.'}" The difficulty in your chart is not external circumstance but internal energy configuration. ${strength === 'strong' ? 'Strong charts are trapped in "excessive rigidity"; know that softness overcomes hardness, and water wears through stone.' : strength === 'weak' ? 'Weak charts are trapped in "excessive softness"; know that accumulated softness becomes firm, and dripping water penetrates stone.' : 'Balanced charts are trapped in "indecision"; know that holding to one principle completes all, and guarding the center encompasses the whole.'}

**Career dimension**: ${tenGods.monthGan === '正官' || tenGods.monthGan === '七杀' ? 'Your Officer gods are prominent, giving you strong career drive and clear goals, yet you may over-bind self-worth to social achievement. When external circumstances are unfavorable, this binding creates deep anxiety. Separate "doing" from "being" — career is a field of practice, not the entirety of existence.' : tenGods.monthGan === '正财' || tenGods.monthGan === '偏财' ? 'Your Wealth gods command the month, giving you natural sensitivity to material security, yet you may lose yourself between "enough" and "more." Remember that destiny-wealth is not merely money but the value and influence you create.' : tenGods.monthGan === '食神' || tenGods.monthGan === '伤官' ? 'Your Output gods express abundantly, giving you rich creativity, yet you may scatter across too many ideas or delay action seeking perfection. Choose one direction to deepen, transforming talent into deliverable results.' : 'Your Resource gods nourish the self, giving you strong learning capacity, yet you may delay action through overthinking or rely on knowledge at the expense of practice. Transform "knowing" into "doing" and test truth through action.'}

**Relationship dimension**: ${pol === 'Yin' ? 'You carry Yin energy, tending toward inner perception and deep connection in relationships. Your challenge is opening to others while maintaining self-boundaries.' : 'You carry Yang energy, tending toward active expression and initiative in relationships. Your challenge is pursuing goals while respecting the rhythms and needs of others.'}${favorableGods.includes('正财') || favorableGods.includes('偏财') ? ' With Wealth as favorable, you value practical giving and material security in relationships, yet be mindful whether "giving" substitutes for "presence."' : favorableGods.includes('正官') || favorableGods.includes('七杀') ? ' With Officer as favorable, you value responsibility and commitment, yet be mindful whether "rules" substitute for "warmth."' : favorableGods.includes('食神') || favorableGods.includes('伤官') ? ' With Output as favorable, you value intellectual exchange and spiritual resonance, yet be mindful whether "dialogue" substitutes for "listening."' : ' With Resource as favorable, you value understanding and support, yet be mindful whether "care" substitutes for "equality."'}

**Health dimension**: Your ${organ} system is the core organ governed by your chart. ${strength === 'strong' ? 'With strong constitution, qi and blood are vigorous; focus on drainage rather than supplementation. Choose gentle exercises like Tai Chi or yoga; avoid excessive intensity.' : strength === 'weak' ? 'With weak constitution, qi and blood are deficient; focus on nourishment rather than consumption. Prioritize early sleep, warm diet, and avoid cold foods.' : 'With balanced constitution, qi and blood are harmonious; maintain regular routines without deliberate modification.'} This insight is for entertainment and self-reflection purposes only.`,

    chapter6: `Meditation and practice are the fundamental path to transform destiny. The Yellow Emperor's Inner Canon states: "With tranquility and emptiness, true qi follows; with spirit guarded within, how can illness arise?" The following regimen is tailored to your ${el} nature, ${str} constitution, and favorable elements (${favText}).

**Morning practice** (5:00–7:00 AM or around sunrise):
${practice}

**Midday regulation** (11:00 AM–1:00 PM or lunch break):
Before lunch, sit quietly for five minutes using breath-counting to settle the mind: inhale while mentally counting "one," exhale while mentally saying "relax," repeating ten times. This clears ${organ} excess fire and nourishes spleen-stomach center qi, ensuring afternoon vitality without agitation.

**Evening closing** (9:00–11:00 PM or before sleep):
${strength === 'strong' ? 'With strong constitution, evening practice should "descend" rather than "ascend." Soak feet in warm water for 15–20 minutes before sleep, massaging the Yongquan point (the depression in the front third of the sole), visualizing daytime excited qi draining through the soles into the earth.' : strength === 'weak' ? 'With weak constitution, evening practice should "nourish" rather than "expend." Warm your palms by rubbing them together, then place them over the lower dantian (three inches below the navel), coordinating with "inhale and lift the perineum, exhale and relax the whole body," nine repetitions, to replenish original qi and secure the root.' : 'With balanced constitution, evening practice should "balance" rather than "lean." Take a walk or gentle stretching before sleep, then use "breath observation" to fall asleep: gently rest attention on the breath at the nostrils, without controlling or following, like a witness quietly observing, naturally drifting into sleep.'}

**Mental anchor and visualization mantra**:
Your daily visualization object is ${el === 'wood' ? '"an ancient towering tree, roots deep and branches lush, growing in spring, flourishing in summer, harvesting in autumn, storing in winter — seasons turn, yet the tree remains"' : el === 'fire' ? '"a perpetual lamp with steady flame, not flickering with wind, not worrying about oil exhaustion — its light illuminates itself and others"' : el === 'earth' ? '"vast earth carrying mountains and rivers, rejecting no stream, selecting no plant — all things grow, yet it claims no credit"' : el === 'metal' ? '"a raw jade, un-carved yet containing warmth within, through fire and blade becoming a vessel, yet never losing its essence"' : '"deep still water, surface calm without waves, beneath currents moving — receiving all rivers without contention, dwelling low yet nourishing all things"'}. When emotions fluctuate or decisions hesitate, close your eyes and visualize this image for thirty seconds to quickly return to inner center.

**Seasonal adjustments**:
During ${el === 'wood' ? 'Beginning of Spring, Awakening of Insects, and Clear Brightness' : el === 'fire' ? 'Beginning of Summer, Summer Solstice, and Great Heat' : el === 'earth' ? 'the eighteen days after Beginning of Spring, late summer, and the ends of four seasons' : el === 'metal' ? 'Beginning of Autumn, White Dew, and Frost Descent' : 'Beginning of Winter, Winter Solstice, and Great Cold'}, your ${el} energy will experience significant fluctuations. Increase meditation to thirty minutes around these solar terms, and arrange ${favText}-element objects (such as ${favorableElements[0] === 'wood' ? 'green plant essential oils' : favorableElements[0] === 'fire' ? 'red candles' : favorableElements[0] === 'earth' ? 'yellow crystals' : favorableElements[0] === 'metal' ? 'metal wind chimes' : 'blue water features'}) in your practice space to enhance resonance with celestial rhythms. This insight is for entertainment and self-reflection purposes only.`,

    chapter7: `Action strategies must be specific, verifiable, and quantifiable. The following three are arranged by priority; choose one to practice deeply.

**First priority: Energy field arrangement** (Timeframe: initiate within 7 days, continue for 21 days)
${action1}

**Second priority: Daily heart method practice** (Timeframe: start tomorrow, continue for 21 days)
${action2}

**Third priority: Benefactor connection and information gathering** (Timeframe: complete within this month)
${action3}

All three strategies are directly tied to your chart data, not generic advice. As the saying goes, "One who knows destiny does not stand beneath a crumbling wall," and even more importantly, "One who creates destiny can turn misfortune into blessing." Action is the only path of transformation. Visualization and planning, without practice, become castles in the air. Use twenty-one days as one cycle, choose one strategy to execute deeply, then review and adjust. This insight is for entertainment and self-reflection purposes only.`,

    chapter8: `${verse}

**Daily heart method mantra**:
${el === 'wood' ? '"The virtue of Wood holds benevolence, generating without cease; daily progress, eventually reaching the sky." Recite three times each morning upon waking, visualizing yourself as a sprout breaking through soil — small yet resilient.' : el === 'fire' ? '"The virtue of Fire is propriety, inner light illuminating; holding to one point unmoving, spiritual light shines of itself." Recite three times each morning, visualizing warm, steady light at your heart center.' : el === 'earth' ? '"The virtue of Earth is trustworthiness, bearing all with deep virtue; guarding the center and embracing oneness, beginning and end are complete." Recite three times each morning, visualizing yourself as steady as the earth.' : el === 'metal' ? '"The virtue of Metal is righteousness, yielding and changing with measure; firmness and flexibility complementing, the Dao is found therein." Recite three times each morning, visualizing yourself as metal, clear inside and out.' : '"The virtue of Water is wisdom, nurturing below without contention; overcoming hardness with softness, the Dao is eternally constant." Recite three times each morning, visualizing yourself as deep, still water flowing profound.'}

The birth chart is like a map — it shows direction but cannot walk for you. Fortune is like weather — it affects the journey but does not determine the destination. You are the author of your own destiny; astrology merely helps you read the ink on the page. May you find your own path, nourished by Eastern wisdom. This insight is for entertainment and self-reflection purposes only.`,
  };
}

// ============ 统一入口 ============

export function getFallbackReport(bazi: BaziResult, locale: 'en' | 'zh'): AIReport {
  if (locale === 'zh') {
    return buildZhFallback(bazi);
  }
  return buildEnFallback(bazi);
}
