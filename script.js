// ====== 1. 初始化 Supabase (添加在文件最顶端) ======
const supabaseUrl = 'https://afuewegupycldgqwmyiv.supabase.co';
const supabaseKey = 'sb_publishable_vca15z0QMvN6nkQTFd90wQ_FuCFHKWQ';
// 注意：这里要用 window.supabase，因为我们是从 HTML 的 CDN 引入的
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
let userInfo = {
  name: "",
  department: "",
  position: ""
};
// ====== 题目数据（40题） ======
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

// ====== 状态：当前第几题 + 每题的答案（D/I/S/C） ======
let currentIndex = 0;
const answers = new Array(questions.length).fill(null);

// ====== 拿到页面元素 ======
const questionBox = document.getElementById("questionBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const selectedTextEl = document.getElementById("selectedText");
const progressBarEl = document.getElementById("progressBar");
const progressTextEl = document.getElementById("progressText");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const resultBox = document.getElementById("resultBox");
const mainTypeEl = document.getElementById("mainType");
const scoreListEl = document.getElementById("scoreList");
const restartBtn = document.getElementById("restartBtn");

// 结果说明（你之后可以写得更详细）
const desc = {
  D: "D（支配型）：目标导向、果断直接、喜欢挑战。",
  I: "I（影响型）：外向热情、善于表达、重视互动。",
  S: "S（稳健型）：温和可靠、重视关系与稳定。",
  C: "C（谨慎型）：理性严谨、重视标准与准确。",
};

// 选项显示用 A/B/C/D（不暴露 DISC）
const labels = ["A", "B", "C", "D"];
// 处理用户信息表单提交
const userForm = document.getElementById("userForm");
userForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 防止页面刷新

  // 获取表单中的数据
  userInfo.name = document.getElementById("name").value;
  userInfo.department = document.getElementById("department").value;
  userInfo.position = document.getElementById("position").value;

  // 显示测评页面，隐藏用户信息表单
  document.getElementById("userInfo").style.display = "none";
  questionBox.style.display = "block";

  // 初始渲染题目
  renderQuestion();
});
// ====== 渲染当前题目 ======
function renderQuestion() {
  const q = questions[currentIndex];

  // 标题
  questionEl.textContent = q.title;

  // 清空旧选项
  optionsEl.innerHTML = "";

  // 生成新选项按钮
  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.dataset.type = opt.type;

    // 显示 A/B/C/D
    btn.textContent = `${labels[index]}：${opt.text}`;

    // 回显高亮（按 D/I/S/C 判断）
    if (answers[currentIndex] === opt.type) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      answers[currentIndex] = opt.type;

      [...optionsEl.querySelectorAll(".option")].forEach((b) =>
        b.classList.remove("selected")
      );
      btn.classList.add("selected");

      // 底部只显示 A/B/C/D
      selectedTextEl.textContent = `你选择了：${labels[index]}`;
    });

    optionsEl.appendChild(btn);
  });

  // 底部文字回显（只显示 A/B/C/D）
  if (answers[currentIndex] === null) {
    selectedTextEl.textContent = "你还没选择";
  } else {
    const idx = q.options.findIndex((opt) => opt.type === answers[currentIndex]);
    selectedTextEl.textContent =
      idx >= 0 ? `你选择了：${labels[idx]}` : "你已作答";
  }

  // 按钮状态
  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === questions.length - 1 ? "提交" : "下一题";

  // 进度条 + 题号
  const total = questions.length;
  const now = currentIndex + 1;
  const percent = Math.round((now / total) * 100);
  progressBarEl.style.width = percent + "%";
  progressTextEl.textContent = `进度：第 ${now} / ${total} 题`;
}

// ====== 出结果：主型 + 次型 ======
function showResult() {
  // 在结果页显示用户信息
  mainTypeEl.textContent = `测评结果：${userInfo.name}（${userInfo.department} - ${userInfo.position}）\n\n`;

  const firstEmpty = answers.findIndex((a) => a === null);
  if (firstEmpty !== -1) {
    alert(`你还有第 ${firstEmpty + 1} 题没有作答哦～`);
    currentIndex = firstEmpty;
    renderQuestion();
    return;
  }

  const scores = { D: 0, I: 0, S: 0, C: 0 };
  answers.forEach((t) => (scores[t] += 1));

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [mainType, mainScore] = entries[0];
  const [secondType, secondScore] = entries[1];

  questionBox.style.display = "none";
  resultBox.style.display = "block";

  // 显示主型 + 次型
  if (secondScore === mainScore) {
    const tied = entries.filter(([_, v]) => v === mainScore).map(([k]) => k);
    mainTypeEl.textContent += `并列主型：${tied.join(" / ")}（你在不同场景可能会切换风格）`;
  } else {
    mainTypeEl.textContent += `主型 + 次型：${mainType} + ${secondType}（${mainType} 更突出）`;
  }

  const typesToExplain =
    secondScore === mainScore
      ? entries.filter(([_, v]) => v === mainScore).map(([k]) => k)
      : [mainType, secondType];

  const explainText = typesToExplain.map((t) => `• ${desc[t]}`).join("\n");
  mainTypeEl.textContent += "\n" + explainText;

// 渲染分数列表
  scoreListEl.innerHTML = "";
  entries.forEach(([k, v]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${k}</span><strong>${v}</strong>`;
    scoreListEl.appendChild(li);
  });
  
  // 使用 Chart.js 绘制图表
  const ctx = document.getElementById("resultChart").getContext("2d");

  // 创建条形图
  const resultChart = new Chart(ctx, {
    type: "bar", // 条形图
    data: {
      labels: ["D", "I", "S", "C"], // DISC 类型标签
      datasets: [{
        label: '你的 DISC 类型数量',
        data: [scores.D, scores.I, scores.S, scores.C], // DISC 类型的得分
        backgroundColor: ['#ff4d4d', '#4d94ff', '#66b266', '#ffcc00'], // 每个条形的颜色
        borderColor: ['#ff0000', '#0051ff', '#1e7a1e', '#ff9900'], // 每个条形的边框颜色
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
// ====== 上一题 / 下一题 ======
prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (answers[currentIndex] === null) {
    alert("请先选择一个选项再继续～");
    return;
  }

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResult();
  }
});

// 再测一次
restartBtn.addEventListener("click", () => {
  for (let i = 0; i < answers.length; i++) answers[i] = null;
  currentIndex = 0;

  questionBox.style.display = "block";
  resultBox.style.display = "none";

  renderQuestion();
});

// 初次渲染
renderQuestion();
// ====== 2. 定义上传到云端的函数 (添加在文件最底端) ======
// 我们把它挂载到 window 对象上，这样 HTML 里的按钮才能找到它
window.uploadToCloud = async function() {
    const btn = document.getElementById('uploadBtn');
    
    // 防止还没测完就点
    if (!userInfo.name) {
        alert("请先完成测评！");
        return;
    }

    // 按钮变色，防止重复点击
    btn.innerText = '正在上传...';
    btn.disabled = true;

    // 获取页面上显示的最终结果文字
    const resultText = document.getElementById('mainType').innerText;

    // 发送到 Supabase
    const { data, error } = await supabase
        .from('scores')
        .insert([
            { 
                player_name: userInfo.name,     // 直接使用 script.js 里的变量
                department: userInfo.department,
                position: userInfo.position,
                disc_result: resultText,        // 存入比如 "D (支配型)..."
                score: 0                        // 暂时填0，如果你想存具体分数，我可以教你改
            }
        ]);

    if (error) {
        console.error('上传失败:', error);
        alert('上传失败，请检查网络或联系管理员。\n错误信息: ' + error.message);
        btn.innerText = '重试上传';
        btn.disabled = false;
    } else {
        alert('✅ 成绩已成功同步到后台数据库！');
        btn.innerText = '已上传';
        btn.style.backgroundColor = '#ccc'; // 变灰
    }
}
