console.log("✅ script.js 已加载");

/* ======================
   1) Supabase 初始化
====================== */
const supabaseUrl = "https://ufqwcdftdgfnpxgalvau.supabase.co";
const supabaseKey = "sb_publishable_CCmJITHHkwSw9-hXPLnOfA_LE5HI8AH";

var supabaseClient =
  window._supabaseClient ||
  (window._supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey));

/* ======================
   2) 用户信息 & 总状态
====================== */
let userInfo = { name: "", department: "", position: "" };

// 阶段：DISC -> BIG5 -> RESULT
let currentStage = "DISC"; // "DISC" | "BIG5"
let currentIndex = 0;

const answersDISC = new Array(40).fill(null);  // 每题存 "D/I/S/C"
const answersBIG5 = new Array(20).fill(null);  // 每题存 1~5

let latestDiscScores = null;        // {D,I,S,C}
let latestMainSecond = null;        // {mainType, secondType}
let latestBig5 = null;             // {E,A,C,N,O} (平均分 1~5)

let autoUploaded = false;          // 防止重复上传

/* ======================
   3) DISC 40题（你的原题库）
====================== */
const questions = [
  {
    title: "第 1 题：在团队讨论中，我更倾向于：",
    options: [
      { text: "快速定方向并推动行动", type: "D" },
      { text: "活跃气氛、鼓励大家表达", type: "I" },
      { text: "倾听并照顾大家感受", type: "S" },
      { text: "先弄清信息再发言", type: "C" },
    ],
  },
  {
    title: "第 2 题：遇到压力或时间紧时，我更可能：",
    options: [
      { text: "直接拆解目标、加速推进", type: "D" },
      { text: "找人沟通、互相打气", type: "I" },
      { text: "稳定推进、避免冲突", type: "S" },
      { text: "反复确认细节、降低失误", type: "C" },
    ],
  },
  {
    title: "第 3 题：做决定时，我更看重：",
    options: [
      { text: "结果与效率", type: "D" },
      { text: "共识与影响力", type: "I" },
      { text: "关系与稳定", type: "S" },
      { text: "数据与正确性", type: "C" },
    ],
  },
  {
    title: "第 4 题：开始一个新任务，我通常会：",
    options: [
      { text: "先行动，边做边调整", type: "D" },
      { text: "先沟通愿景，带动伙伴", type: "I" },
      { text: "按步骤来，稳稳完成", type: "S" },
      { text: "先规划流程与检查点", type: "C" },
    ],
  },
  {
    title: "第 5 题：别人更常形容我：",
    options: [
      { text: "果断、有魄力", type: "D" },
      { text: "外向、有感染力", type: "I" },
      { text: "可靠、好相处", type: "S" },
      { text: "严谨、有条理", type: "C" },
    ],
  },
  {
    title: "第 6 题：当出现意见不合时，我更可能：",
    options: [
      { text: "据理力争，尽快定案", type: "D" },
      { text: "表达说服，争取认同", type: "I" },
      { text: "先缓和关系，避免僵局", type: "S" },
      { text: "回到事实与证据上讨论", type: "C" },
    ],
  },
  {
    title: "第 7 题：我更容易被什么激励：",
    options: [
      { text: "挑战、竞争、胜利", type: "D" },
      { text: "认可、关注、互动", type: "I" },
      { text: "安全感、归属感、稳定", type: "S" },
      { text: "标准清晰、专业成长", type: "C" },
    ],
  },
  {
    title: "第 8 题：沟通时我更偏好：",
    options: [
      { text: "简短直接、讲重点", type: "D" },
      { text: "生动有趣、互动多", type: "I" },
      { text: "温和耐心、给支持", type: "S" },
      { text: "结构清楚、信息完整", type: "C" },
    ],
  },
  {
    title: "第 9 题：我更不喜欢：",
    options: [
      { text: "拖拉与低效率", type: "D" },
      { text: "沉闷与缺少交流", type: "I" },
      { text: "冲突与不稳定", type: "S" },
      { text: "混乱与不按规则", type: "C" },
    ],
  },
  {
    title: "第 10 题：在团队里我更常扮演：",
    options: [
      { text: "推动者：把事做成", type: "D" },
      { text: "连接者：凝聚士气", type: "I" },
      { text: "支持者：协作补位", type: "S" },
      { text: "把关者：确保质量", type: "C" },
    ],
  },
  {
    title: "第 11 题：面对变化，我更可能：",
    options: [
      { text: "迅速适应并抢先布局", type: "D" },
      { text: "用热情带动大家接受", type: "I" },
      { text: "希望循序渐进、别太急", type: "S" },
      { text: "先评估风险与影响再动", type: "C" },
    ],
  },
  {
    title: "第 12 题：当我需要完成任务时，我会：",
    options: [
      { text: "设目标、盯进度", type: "D" },
      { text: "边做边沟通、保持动力", type: "I" },
      { text: "稳步推进、持续跟进", type: "S" },
      { text: "列清单、按标准检查", type: "C" },
    ],
  },
  {
    title: "第 13 题：做计划时我更重视：",
    options: [
      { text: "关键路径与结果", type: "D" },
      { text: "团队配合与氛围", type: "I" },
      { text: "可执行与稳定节奏", type: "S" },
      { text: "细节完备与可验证", type: "C" },
    ],
  },
  {
    title: "第 14 题：当别人犯错时，我更可能：",
    options: [
      { text: "直接指出并要求立刻修正", type: "D" },
      { text: "先鼓励再提醒，避免尴尬", type: "I" },
      { text: "私下沟通，照顾对方感受", type: "S" },
      { text: "根据规则和事实分析原因", type: "C" },
    ],
  },
  {
    title: "第 15 题：我更喜欢的工作节奏是：",
    options: [
      { text: "快节奏、高强度、冲刺", type: "D" },
      { text: "多交流、多变化、多互动", type: "I" },
      { text: "稳定持续、少折腾", type: "S" },
      { text: "有流程、有标准、可控", type: "C" },
    ],
  },
  {
    title: "第 16 题：开会时我更可能：",
    options: [
      { text: "推动结论，明确下一步", type: "D" },
      { text: "带动讨论，鼓励发言", type: "I" },
      { text: "协调分歧，促进合作", type: "S" },
      { text: "记录要点，核对事实", type: "C" },
    ],
  },
  {
    title: "第 17 题：我更习惯的表达方式是：",
    options: [
      { text: "结论先行，直截了当", type: "D" },
      { text: "讲故事、举例子", type: "I" },
      { text: "温和委婉、顾及关系", type: "S" },
      { text: "条理清晰、逻辑完整", type: "C" },
    ],
  },
  {
    title: "第 18 题：当我在带新人时，我会：",
    options: [
      { text: "给目标和挑战，让他快速上手", type: "D" },
      { text: "多鼓励多互动，提升信心", type: "I" },
      { text: "一步步陪跑，稳稳练熟", type: "S" },
      { text: "给规范文档和标准示例", type: "C" },
    ],
  },
  {
    title: "第 19 题：面对冲突，我更可能：",
    options: [
      { text: "正面处理，快刀斩乱麻", type: "D" },
      { text: "用沟通化解，争取双赢", type: "I" },
      { text: "先退一步，避免升级", type: "S" },
      { text: "收集信息，按规则处理", type: "C" },
    ],
  },
  {
    title: "第 20 题：我更在意别人怎么看我：",
    options: [
      { text: "是否强、是否能赢", type: "D" },
      { text: "是否受欢迎、被认可", type: "I" },
      { text: "是否可靠、值得信任", type: "S" },
      { text: "是否专业、是否严谨", type: "C" },
    ],
  },
  {
    title: "第 21 题：我在陌生场合通常会：",
    options: [
      { text: "很快找到目标与资源", type: "D" },
      { text: "主动寒暄、结识新朋友", type: "I" },
      { text: "先观察，慢慢融入", type: "S" },
      { text: "保持礼貌，尽量不出错", type: "C" },
    ],
  },
  {
    title: "第 22 题：别人向我求助时，我更可能：",
    options: [
      { text: "给结论和方案，立刻解决", type: "D" },
      { text: "先安慰鼓励，再一起想", type: "I" },
      { text: "耐心陪伴，提供稳定支持", type: "S" },
      { text: "分析原因，给出步骤建议", type: "C" },
    ],
  },
  {
    title: "第 23 题：如果计划被打断，我更可能：",
    options: [
      { text: "马上改策略继续推进", type: "D" },
      { text: "和大家沟通调整，保持情绪", type: "I" },
      { text: "希望尽快恢复原节奏", type: "S" },
      { text: "重新评估细节与风险", type: "C" },
    ],
  },
  {
    title: "第 24 题：我做事更像：",
    options: [
      { text: "冲锋型：要赢、要快", type: "D" },
      { text: "影响型：要人、要场", type: "I" },
      { text: "支持型：要稳、要和", type: "S" },
      { text: "分析型：要准、要对", type: "C" },
    ],
  },
  {
    title: "第 25 题：我更愿意在团队中负责：",
    options: [
      { text: "定目标和推进落地", type: "D" },
      { text: "对外沟通与协调资源", type: "I" },
      { text: "团队支持与执行跟进", type: "S" },
      { text: "质量把控与流程规范", type: "C" },
    ],
  },
  {
    title: "第 26 题：当需要说服别人时，我更可能：",
    options: [
      { text: "强调结果和收益", type: "D" },
      { text: "用感染力与关系推动", type: "I" },
      { text: "慢慢沟通，降低对抗", type: "S" },
      { text: "用数据与逻辑证明", type: "C" },
    ],
  },
  {
    title: "第 27 题：我更常在意：",
    options: [
      { text: "目标有没有达成", type: "D" },
      { text: "大家开不开心", type: "I" },
      { text: "关系是否和谐", type: "S" },
      { text: "过程是否正确", type: "C" },
    ],
  },
  {
    title: "第 28 题：我对规则的态度通常是：",
    options: [
      { text: "能变通就变通，先达成目标", type: "D" },
      { text: "看情况，别影响关系就好", type: "I" },
      { text: "最好稳定一致，别频繁变", type: "S" },
      { text: "规则要清晰并严格执行", type: "C" },
    ],
  },
  {
    title: "第 29 题：当我被批评时，我更可能：",
    options: [
      { text: "反问依据，快速澄清", type: "D" },
      { text: "在意语气，希望被理解", type: "I" },
      { text: "先接受，避免冲突", type: "S" },
      { text: "反思细节，找改进点", type: "C" },
    ],
  },
  {
    title: "第 30 题：我更喜欢的反馈方式是：",
    options: [
      { text: "直说问题和目标", type: "D" },
      { text: "先肯定再建议", type: "I" },
      { text: "温和沟通、给支持", type: "S" },
      { text: "具体清晰、可验证", type: "C" },
    ],
  },
  {
    title: "第 31 题：做选择时，我更容易：",
    options: [
      { text: "快速拍板", type: "D" },
      { text: "和别人讨论再决定", type: "I" },
      { text: "倾向保守，先稳住", type: "S" },
      { text: "多比较，找最优解", type: "C" },
    ],
  },
  {
    title: "第 32 题：当项目出现风险，我会：",
    options: [
      { text: "立刻采取措施控制局面", type: "D" },
      { text: "召集人一起想办法", type: "I" },
      { text: "先稳住团队情绪", type: "S" },
      { text: "列出风险点逐一排查", type: "C" },
    ],
  },
  {
    title: "第 33 题：我更喜欢的领导风格是：",
    options: [
      { text: "给挑战与授权", type: "D" },
      { text: "鼓励与认可", type: "I" },
      { text: "稳定与关怀", type: "S" },
      { text: "清晰标准与专业指导", type: "C" },
    ],
  },
  {
    title: "第 34 题：面对大量细节时，我会：",
    options: [
      { text: "抓重点，先把进度推起来", type: "D" },
      { text: "找人协作，边沟通边处理", type: "I" },
      { text: "耐心做完，按节奏推进", type: "S" },
      { text: "系统整理，确保准确", type: "C" },
    ],
  },
  {
    title: "第 35 题：当团队士气低落时，我会：",
    options: [
      { text: "定目标、打胜仗提士气", type: "D" },
      { text: "带动气氛、组织互动", type: "I" },
      { text: "关心大家，提供支持", type: "S" },
      { text: "复盘原因，优化机制", type: "C" },
    ],
  },
  {
    title: "第 36 题：我更擅长：",
    options: [
      { text: "做决策并推进", type: "D" },
      { text: "沟通表达与影响", type: "I" },
      { text: "持续执行与协作", type: "S" },
      { text: "分析规划与把控质量", type: "C" },
    ],
  },
  {
    title: "第 37 题：我更害怕：",
    options: [
      { text: "失去掌控、被拖慢", type: "D" },
      { text: "被忽视、不被喜欢", type: "I" },
      { text: "关系破裂、环境动荡", type: "S" },
      { text: "出错、被质疑不专业", type: "C" },
    ],
  },
  {
    title: "第 38 题：当我需要做汇报时，我会：",
    options: [
      { text: "先讲结论和目标", type: "D" },
      { text: "讲亮点和故事吸引人", type: "I" },
      { text: "讲过程与团队协作", type: "S" },
      { text: "讲数据、依据和细节", type: "C" },
    ],
  },
  {
    title: "第 39 题：面对不确定性，我更可能：",
    options: [
      { text: "先试再说，抢先一步", type: "D" },
      { text: "拉人一起试，保持热情", type: "I" },
      { text: "希望有人带路，稳一点", type: "S" },
      { text: "先研究清楚再行动", type: "C" },
    ],
  },
  {
    title: "第 40 题：总体来说，我更认同自己是：",
    options: [
      { text: "以结果为先的行动派", type: "D" },
      { text: "以人和影响为先的沟通派", type: "I" },
      { text: "以稳定和支持为先的协作派", type: "S" },
      { text: "以严谨和标准为先的分析派", type: "C" },
    ],
  },
];

/* ======================
   4) 大五人格 20题（1~5分）
   reverse=true 表示反向计分：6-分数
====================== */
const big5Questions = [
  // E 外向
  { text: "我很容易和陌生人聊起来", trait: "E", reverse: false },
  { text: "在群体中我通常比较活跃", trait: "E", reverse: false },
  { text: "我喜欢成为大家关注的焦点", trait: "E", reverse: false },
  { text: "我在社交场合中常常比较安静", trait: "E", reverse: true },

  // A 宜人
  { text: "我愿意体谅他人的感受", trait: "A", reverse: false },
  { text: "我乐于帮助别人", trait: "A", reverse: false },
  { text: "我通常信任他人的善意", trait: "A", reverse: false },
  { text: "我在与人相处时容易挑剔", trait: "A", reverse: true },

  // C 尽责
  { text: "我做事有计划、有条理", trait: "C", reverse: false },
  { text: "我会坚持把事情做到最后", trait: "C", reverse: false },
  { text: "我做事认真，重视责任", trait: "C", reverse: false },
  { text: "我有时会拖延该做的事情", trait: "C", reverse: true },

  // N 神经质
  { text: "我容易感到紧张或焦虑", trait: "N", reverse: false },
  { text: "我情绪波动比较大", trait: "N", reverse: false },
  { text: "我容易为小事担心", trait: "N", reverse: false },
  { text: "我在压力下通常能保持冷静", trait: "N", reverse: true },

  // O 开放
  { text: "我对新事物和新想法感兴趣", trait: "O", reverse: false },
  { text: "我喜欢尝试不同的体验", trait: "O", reverse: false },
  { text: "我富有想象力", trait: "O", reverse: false },
  { text: "我不太喜欢改变原有的方式", trait: "O", reverse: true },
];

/* ======================
   5) DOM 元素
====================== */
const userForm = document.getElementById("userForm");
const userInfoBox = document.getElementById("userInfo");

const questionBox = document.getElementById("questionBox");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const selectedTextEl = document.getElementById("selectedText");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progressBarEl = document.getElementById("progressBar");
const progressTextEl = document.getElementById("progressText");

const resultBox = document.getElementById("resultBox");
const mainTypeEl = document.getElementById("mainType");
const scoreListEl = document.getElementById("scoreList");
const restartBtn = document.getElementById("restartBtn");
const uploadBtn = document.getElementById("uploadBtn");

/* ======================
   6) 文案
====================== */
const discDesc = {
  D: "D（支配型）：目标导向、果断直接、喜欢挑战。",
  I: "I（影响型）：外向热情、善于表达、重视互动。",
  S: "S（稳健型）：温和可靠、重视关系与稳定。",
  C: "C（谨慎型）：理性严谨、重视标准与准确。",
};

const discLabels = ["A", "B", "C", "D"];

const big5ChoiceLabels = [
  "1 非常不同意",
  "2 不同意",
  "3 一般",
  "4 同意",
  "5 非常同意",
];

/* ======================
   7) 绑定表单：开始测评
====================== */
if (userForm) {
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    userInfo.name = document.getElementById("name")?.value?.trim() || "";
    userInfo.department = document.getElementById("department")?.value?.trim() || "";
    userInfo.position = document.getElementById("position")?.value?.trim() || "";

    // 重置状态
    currentStage = "DISC";
    currentIndex = 0;
    answersDISC.fill(null);
    answersBIG5.fill(null);
    latestDiscScores = null;
    latestMainSecond = null;
    latestBig5 = null;
    autoUploaded = false;

    // UI切换
    if (userInfoBox) userInfoBox.style.display = "none";
    if (questionBox) questionBox.style.display = "block";
    if (resultBox) resultBox.style.display = "none";

    renderQuestion();
  });
} else {
  console.error("❌ 找不到 #userForm，请检查 HTML 里 id 是否正确");
}

/* ======================
   8) 渲染题目（DISC / BIG5 通用）
====================== */
function renderQuestion() {
  if (!questionEl || !optionsEl || !nextBtn) return;

  optionsEl.innerHTML = "";
  selectedTextEl && (selectedTextEl.textContent = "你还没选择");
  nextBtn.textContent = "下一题";
  nextBtn.disabled = true;

  // 进度（总 60 题）
  const total = questions.length + big5Questions.length;
  const done = (currentStage === "DISC")
    ? currentIndex
    : questions.length + currentIndex;
  updateProgress(done + 1, total);

  if (currentStage === "DISC") {
    const q = questions[currentIndex];
    questionEl.textContent = q.title;

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.textContent = `${discLabels[idx]}：${opt.text}`;

      btn.addEventListener("click", () => {
        answersDISC[currentIndex] = opt.type;

        // 高亮
        [...optionsEl.querySelectorAll(".option")].forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        selectedTextEl && (selectedTextEl.textContent = `你选择了：${discLabels[idx]}`);
        nextBtn.disabled = false;
      });

      optionsEl.appendChild(btn);
    });

    // 上一题按钮
    if (prevBtn) prevBtn.disabled = (currentIndex === 0);

    // 最后一题改“进入大五”
    if (currentIndex === questions.length - 1) {
      nextBtn.textContent = "进入大五人格";
    }
  } else {
    const q = big5Questions[currentIndex];
    questionEl.textContent = `大五人格（第 ${currentIndex + 1} / ${big5Questions.length} 题）：${q.text}`;

    // 1~5 选项
    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.textContent = big5ChoiceLabels[i - 1];

      btn.addEventListener("click", () => {
        answersBIG5[currentIndex] = i;

        // 高亮
        [...optionsEl.querySelectorAll(".option")].forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        selectedTextEl && (selectedTextEl.textContent = `你选择了：${i}`);
        nextBtn.disabled = false;
      });

      optionsEl.appendChild(btn);
    }

    // 上一题按钮（大五阶段也可回退）
    if (prevBtn) prevBtn.disabled = (currentIndex === 0);

    // 大五最后一题
    if (currentIndex === big5Questions.length - 1) {
      nextBtn.textContent = "提交并查看结果";
    }
  }
}

function updateProgress(now, total) {
  if (progressTextEl) progressTextEl.textContent = `进度：第 ${now} / ${total} 题`;
  if (progressBarEl) progressBarEl.style.width = Math.round((now / total) * 100) + "%";
}

/* ======================
   9) 上一题 / 下一题
====================== */
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    renderQuestion();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    // 必须选了才能下一步
    if (currentStage === "DISC") {
      if (!answersDISC[currentIndex]) {
        alert("请先选择一个选项再继续～");
        return;
      }

      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        // DISC 完成 -> BIG5
        currentStage = "BIG5";
        currentIndex = 0;
        renderQuestion();
      }
    } else {
      if (!answersBIG5[currentIndex]) {
        alert("请先选择一个选项再继续～");
        return;
      }

      if (currentIndex < big5Questions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        // BIG5 完成 -> 结果
        showResult();
      }
    }
  });
}

/* ======================
   10) 结果页（DISC + BIG5）
====================== */
let discBarChart = null;
let big5RadarChart = null;

function showResult() {
  // 防漏答
  const discEmpty = answersDISC.findIndex(a => a === null);
  if (discEmpty !== -1) {
    alert(`DISC 还有第 ${discEmpty + 1} 题没答完`);
    currentStage = "DISC";
    currentIndex = discEmpty;
    renderQuestion();
    return;
  }
  const big5Empty = answersBIG5.findIndex(a => a === null);
  if (big5Empty !== -1) {
    alert(`大五人格还有第 ${big5Empty + 1} 题没答完`);
    currentStage = "BIG5";
    currentIndex = big5Empty;
    renderQuestion();
    return;
  }

  // UI切换
  if (questionBox) questionBox.style.display = "none";
  if (resultBox) resultBox.style.display = "block";

  /* ---- DISC 计算 ---- */
  const discScores = { D: 0, I: 0, S: 0, C: 0 };
  answersDISC.forEach(t => discScores[t]++);
  latestDiscScores = discScores;

  const entries = Object.entries(discScores).sort((a, b) => b[1] - a[1]);
  const [mainType, mainScore] = entries[0];
  const [secondType, secondScore] = entries[1];
  latestMainSecond = { mainType, secondType };

  /* ---- BIG5 计算（平均分 1~5）---- */
  const bucket = { E: [], A: [], C: [], N: [], O: [] };

  big5Questions.forEach((q, idx) => {
    let v = answersBIG5[idx];
    if (q.reverse) v = 6 - v;
    bucket[q.trait].push(v);
  });

  const avg = {};
  Object.keys(bucket).forEach(k => {
    avg[k] = +(bucket[k].reduce((a, b) => a + b, 0) / bucket[k].length).toFixed(2);
  });
  latestBig5 = avg;

  /* ---- 文本展示 ---- */
  if (mainTypeEl) {
  // 名字部门一行
  const line1 = `测评结果：${userInfo.name}（${userInfo.department} - ${userInfo.position}）`;

  // DISC 一段
  const discBlock =
    `DISC 结果：\n` +
    `主型 + 次型：${mainType} + ${secondType}\n` +
    `• ${discDesc[mainType]}\n` +
    `• ${discDesc[secondType]}`;

  // 大五人格一段
  const big5Block =
     // 大五人格一段
  const big5Block =
    `大五人格（1~5 分）：\n` +
    `外向性 E：${avg.E}\n` +
    `宜人性 A：${avg.A}\n` +
    `尽责性 C：${avg.C}\n` +
    `神经质 N：${avg.N}\n` +
    `开放性 O：${avg.O}`;

  // ✅ 关键：用两个空行分段（把文字真正写到页面上）
  mainTypeEl.textContent = `${line1}\n\n${discBlock}\n\n${big5Block}`;
} // ✅ 结束 if (mainTypeEl)

/* ---- DISC 分数列表 ---- */
if (scoreListEl) {
  scoreListEl.innerHTML = "";
  entries.forEach(([k, v]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${k}</span><strong>${v}</strong>`;
    scoreListEl.appendChild(li);
  });
}

/* ---- DISC 柱状图 ---- */
const discCanvas = document.getElementById("resultChart");
if (discCanvas && window.Chart) {
  const ctx = discCanvas.getContext("2d");
  if (discBarChart) discBarChart.destroy();

  discBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["D", "I", "S", "C"],
      datasets: [{
        label: "DISC 数量",
        data: [discScores.D, discScores.I, discScores.S, discScores.C],
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}

/* ---- BIG5 雷达图 ---- */
const radarCanvas = document.getElementById("big5RadarChart");
if (radarCanvas && window.Chart) {
  const ctx = radarCanvas.getContext("2d");
  if (big5RadarChart) big5RadarChart.destroy();

  big5RadarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["外向性 E", "宜人性 A", "尽责性 C", "神经质 N", "开放性 O"],
      datasets: [{
        label: "大五人格（1–5）",
        data: [avg.E, avg.A, avg.C, avg.N, avg.O],
        fill: true,
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        r: { min: 1, max: 5, ticks: { stepSize: 1 } }
      }
    }
  });
}
  // 自动上传
  autoUploadToSupabase();
}

/* ======================
   11) 自动上传 Supabase（一次）
   表 disc_results 建议新增字段：
   - big5_e, big5_a, big5_c, big5_n, big5_o (numeric)
   - big5_scores (jsonb)
====================== */
async function autoUploadToSupabase() {
  if (autoUploaded) return;
  autoUploaded = true;

  if (uploadBtn) {
    uploadBtn.innerText = "正在自动上传...";
    uploadBtn.disabled = true;
  }

  const payload = {
    // 如果你表里没有 name 字段，会报 “column does not exist”
    // 你可以在 Supabase 表里加一个 name(text)；否则把下一行删掉
    name: userInfo.name,

    department: userInfo.department,
    position: userInfo.position,

    d_score: latestDiscScores?.D ?? 0,
    i_score: latestDiscScores?.I ?? 0,
    s_score: latestDiscScores?.S ?? 0,
    c_score: latestDiscScores?.C ?? 0,

    main_type: latestMainSecond?.mainType ?? null,
    secondary_type: latestMainSecond?.secondType ?? null,

    scores: latestDiscScores,

    // BIG5（需要你在表里加字段）
    big5_e: latestBig5?.E ?? null,
    big5_a: latestBig5?.A ?? null,
    big5_c: latestBig5?.C ?? null,
    big5_n: latestBig5?.N ?? null,
    big5_o: latestBig5?.O ?? null,
    big5_scores: latestBig5,
  };

  const { error } = await supabaseClient.from("disc_results").insert([payload]);

  if (error) {
    console.error("上传失败:", error);
    alert("上传失败：" + error.message);
    if (uploadBtn) {
      uploadBtn.innerText = "重试上传";
      uploadBtn.disabled = false;
    }
    autoUploaded = false; // 允许重试
  } else {
    console.log("✅ 已上传 DISC + 大五人格");
    if (uploadBtn) {
      uploadBtn.innerText = "已上传";
      uploadBtn.disabled = true;
      uploadBtn.style.backgroundColor = "#ccc";
    }
  }
}

/* ======================
   12) 再测一次
====================== */
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    // 回到填写信息页（最稳）
    if (userInfoBox) userInfoBox.style.display = "block";
    if (questionBox) questionBox.style.display = "none";
    if (resultBox) resultBox.style.display = "none";

    // 清空输入框（可选）
    const nameEl = document.getElementById("name");
    const deptEl = document.getElementById("department");
    const posEl = document.getElementById("position");
    if (nameEl) nameEl.value = "";
    if (deptEl) deptEl.value = "";
    if (posEl) posEl.value = "";

    // 重置
    currentStage = "DISC";
    currentIndex = 0;
    answersDISC.fill(null);
    answersBIG5.fill(null);
    autoUploaded = false;

    // 按钮复原
    if (uploadBtn) {
      uploadBtn.innerText = "提交结果到后台";
      uploadBtn.disabled = false;
      uploadBtn.style.backgroundColor = "";
    }
  });
}

// 如果你 HTML 里仍然保留 onclick="uploadToCloud()"，避免报错：给个兼容入口
window.uploadToCloud = async function () {
  await autoUploadToSupabase();
};


