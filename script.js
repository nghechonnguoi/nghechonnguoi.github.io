// ============================================================================
// IKIGAI ENGINE — Universal Layered Architecture v5.0
// Giám đốc Kiến trúc Thuật toán EdTech
//
//  ICI = (S_identity × 0.60) + (S_niche × 0.25) + (S_market × 0.15)
//
//  VÒNG 1 — Bản ngã Tố chất Nhân số học   (1001 → TOP 15)
//  VÒNG 2 — Định vị Môi trường & Hành vi  (15   → TOP 10)
//            ↳ RIASEC Hexagon Penalty
//            ↳ MBTI Compatibility
//            ↳ Ikigai Talent Bonus (SPEECH / STRATEGY / CRAFT)
//            ↳ Dream Alignment + Holland Cross-check (+20)
//  VÒNG 3 — Tối ưu Xu hướng & Dòng tiền  (10   → TOP 5 )
//            ↳ Theory/Language Penalty (×0.60)
//            ↳ Diversity Guard (≤2 ngành cùng industry)
// ============================================================================
// =========================================================================
// 🔥 CẤU HÌNH HẠ TẦNG ĐÁM MÂY FIREBASE THỰC TẾ CỦA BẠN
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDXYwk4_lfXDGp3L8wcUt9NEdduNsGl_t4",
  authDomain: "nghechonnguoi-f9eec.firebaseapp.com",
  projectId: "nghechonnguoi-f9eec",
  storageBucket: "nghechonnguoi-f9eec.firebasestorage.app",
  messagingSenderId: "803032497022",
  appId: "1:803032497022:web:bb8c7869c77c439c14912f",
  measurementId: "G-0XDEKKR2WG"
};

// Khởi tạo các phân hệ đám mây (Giữ nguyên phần code khởi tạo phía dưới)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
// LẮNG NGHE TRẠNG THÁI TÀI KHOẢN (TỰ ĐỘNG ĐÓNG/MỞ KHÓA WEBAPP)
auth.onAuthStateChanged((user) => {
  const authView = document.getElementById("auth-container");
  if (user) {
    // Nếu đã đăng nhập thành công -> Ẩn màn hình khóa đi để làm bài test
    authView.classList.add("hidden");
    console.log("Đã kết nối tài khoản khách hàng:", user.email);

    // Tự động điền email của người dùng vào form nếu hòm thư đang trống
    if (document.getElementById("customerEmail")) {
      document.getElementById("customerEmail").value = user.email;
    }
  } else {
    // Nếu chưa đăng nhập hoặc đã bấm đăng xuất -> Hiện lại màn hình khóa
    authView.classList.remove("hidden");
  }
});

// Hàm xử lý Đăng nhập nhanh bằng Google Pop-up
async function handleGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    alert("Đăng nhập tài khoản Google thành công!");
  } catch (error) {
    alert("Lỗi đăng nhập Google: " + error.message);
  }
}

// Hàm xử lý Đăng ký tài khoản Email mới
async function handleEmailRegister() {
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  if (!email || !password) { alert("Vui lòng nhập đủ Email và Mật khẩu!"); return; }

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert("Tạo tài khoản thành công! Bạn có thể làm bài test ngay bây giờ.");
  } catch (error) {
    alert("Lỗi đăng ký: " + error.message);
  }
}

// Hàm xử lý Đăng nhập Email truyền thống
async function handleEmailLogin() {
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  if (!email || !password) { alert("Vui lòng nhập đủ Email và Mật khẩu!"); return; }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("Đăng nhập thành công!");
  } catch (error) {
    alert("Sai mật khẩu hoặc tài khoản chưa đăng ký: " + error.message);
  }
}

// Hàm đăng xuất (Gọi hàm này khi muốn khóa hệ thống lại)
function handleLogout() {
  auth.signOut().then(() => {
    location.reload();
  });
}
// ─── TRẠNG THÁI TOÀN CỤC ────────────────────────────────────────────────────
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};

// ─── KHỞI ĐỘNG SAU KHI DOM LOAD ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profile-form");
  if (!profileForm) return;

  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const studentProfile = {
      fullName: document.getElementById("fullName").value.trim(),
      birthDate: document.getElementById("birthDate").value.trim(),
      email: document.getElementById("customerEmail").value.trim(),
      phone: document.getElementById("customerPhone").value.trim(),
      thptScores: {
        toan: parseFloat(document.getElementById("score_toan").value) || 0,
        van: parseFloat(document.getElementById("score_van").value) || 0,
        anh: parseFloat(document.getElementById("score_anh").value) || 0,
        ly: parseFloat(document.getElementById("score_ly").value) || 0,
        hoa: parseFloat(document.getElementById("score_hoa").value) || 0,
        sinh: parseFloat(document.getElementById("score_sinh").value) || 0,
        su: parseFloat(document.getElementById("score_su").value) || 0,
        dia: parseFloat(document.getElementById("score_dia").value) || 0,
        gdcd: parseFloat(document.getElementById("score_gdcd").value) || 0,
      },
      gpa: parseFloat(document.getElementById("gpaManual").value) || 0,
      gpaFileName: document.getElementById("gpaFile").files[0]?.name || null,
      dgnl: {
        hsa: parseInt(document.getElementById("dgnlHsa").value) || 0,
        hcm: parseInt(document.getElementById("dgnlHcm").value) || 0,
      },
      languageCertification: {
        type: document.getElementById("langType").value,
        score: document.getElementById("langScore").value.trim()
      }
    };

    localStorage.setItem("active_student_profile", JSON.stringify(studentProfile));

    document.getElementById("profile-container").classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    startQuizEngine();
  });
});

// ─── NẠP VÀ CHẠY CÂU HỎI ────────────────────────────────────────────────────
async function startQuizEngine() {
  try {
    const res = await fetch("data/questions.json");
    const data = await res.json();

    // Gộp Holland + MBTI + Ikigai
    questions = [
      ...(data.holland_questions || []),
      ...(data.mbti_questions || []),
      ...(data.ikigai_questions || [])
    ];

    currentQuestionIndex = 0;
    userAnswers = {};

    // Cập nhật tổng số câu hỏi động (tránh hardcode trong HTML)
    const totalQEl = document.getElementById('total-q');
    if (totalQEl) totalQEl.innerText = questions.length;

    displayQuestion();

  } catch (err) {
    console.error("Lỗi nạp câu hỏi:", err);
    document.getElementById("question-content").innerText =
      "Không thể tải câu hỏi. Vui lòng kiểm tra file data/questions.json!";
  }
}

// ─── HIỂN THỊ TỪNG CÂU HỎI ───────────────────────────────────────────────────
function displayQuestion() {
  if (!questions.length) return;

  const q = questions[currentQuestionIndex];
  const pct = (currentQuestionIndex / questions.length) * 100;

  document.getElementById("current-q").innerText = currentQuestionIndex + 1;
  document.getElementById("progress-fill").style.width = `${pct}%`;

  // Hỗ trợ cả 2 trường `text` (Holland/MBTI) và `question` (Ikigai)
  const questionText = q.text || q.question || "";
  document.getElementById("question-content").innerText =
    `${currentQuestionIndex + 1}. ${questionText}`;

  const container = document.getElementById("options-space");
  container.innerHTML = "";

  // --- Phân loại hiển thị đáp án ---
  if (q.type === "ikigai_dream") {
    // Câu tự luận ước mơ — textarea
    const ta = document.createElement("textarea");
    ta.id = "ikigai-dream-input";
    ta.rows = 3;
    ta.placeholder = "Nhập ước mơ nghề nghiệp của bạn...";
    ta.style.cssText =
      "width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:8px;" +
      "font-size:15px;resize:none;margin-bottom:12px;box-sizing:border-box;";

    const btn = document.createElement("button");
    btn.className = "btn-option";
    btn.style.fontWeight = "600";
    btn.innerText = "➔ Xác nhận & Tiếp tục";
    btn.onclick = () => {
      const val = ta.value.trim() || "(Không điền)";
      handleSelectOption(q.id, val);
    };

    container.appendChild(ta);
    container.appendChild(btn);

  } else if (q.type === "ikigai_talent") {
    // Câu tài năng — thang 5 mức
    [
      { val: 1, text: "1 - Rất yếu / Không tự tin" },
      { val: 2, text: "2 - Dưới trung bình" },
      { val: 3, text: "3 - Trung bình" },
      { val: 4, text: "4 - Khá tốt / Tự tin" },
      { val: 5, text: "5 - Rất mạnh / Vượt trội" }
    ].forEach(lvl => {
      const btn = document.createElement("button");
      btn.className = "btn-option";
      btn.innerText = lvl.text;
      btn.onclick = () => handleSelectOption(q.id, lvl.val);
      container.appendChild(btn);
    });

  } else if (q.id?.includes("_M") || q.dimension) {
    // MBTI — A/B
    [
      { val: "A", text: "➔ Chọn đáp án A" },
      { val: "B", text: "➔ Chọn đáp án B" }
    ].forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "btn-option";
      btn.style.fontWeight = "600";
      btn.innerText = opt.text;
      btn.onclick = () => handleSelectOption(q.id, opt.val);
      container.appendChild(btn);
    });

  } else {
    // Holland — Likert 1-5
    [
      { val: 1, text: "1 - Hoàn toàn không đúng / Không thích" },
      { val: 2, text: "2 - Ít khi đúng / Hơi thích" },
      { val: 3, text: "3 - Vừa phải / Trung hòa" },
      { val: 4, text: "4 - Khá đúng / Thích" },
      { val: 5, text: "5 - Hoàn toàn chính xác / Rất đam mê" }
    ].forEach(lvl => {
      const btn = document.createElement("button");
      btn.className = "btn-option";
      btn.innerText = lvl.text;
      btn.onclick = () => handleSelectOption(q.id, lvl.val);
      container.appendChild(btn);
    });
  }
}

// ─── XỬ LÝ ĐÁP ÁN ───────────────────────────────────────────────────────────
function handleSelectOption(qId, value) {
  userAnswers[qId] = value;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    finishQuiz();
  }
}

// ─── KẾT THÚC TRẮC NGHIỆM ────────────────────────────────────────────────────
function finishQuiz() {
  document.getElementById("progress-fill").style.width = "100%";
  localStorage.setItem("user_quiz_answers", JSON.stringify(userAnswers));
  console.log("=== HOÀN THÀNH KHẢO SÁT ===", userAnswers);

  document.getElementById("question-content").innerText =
    "🎉 Chúc mừng! Toàn bộ hồ sơ & câu trả lời đã được đóng gói.";

  document.getElementById("options-space").innerHTML = `
    <p style="text-align:center;color:#4a5568;margin-bottom:15px;">
      Hệ thống đang chuẩn bị phân tích tố chất bẩm sinh theo Nhân số học…
    </p>
    <button class="btn-primary" onclick="generateReportUI()">
      Xem Kết Quả Định Vị Ikigai &amp; Nguyện Vọng Ngay ➔
    </button>`;
}

// ============================================================================
//  BỘ NÃO THUẬT TOÁN v5.0 — UNIVERSAL LAYERED ARCHITECTURE
//  ICI = (S_identity × 0.60) + (S_niche × 0.25) + (S_market × 0.15)
//
//  VÒNG 1 — Bản ngã Tố chất Nhân số học   (1001 → TOP 15)
//  VÒNG 2 — Định vị Môi trường & Hành vi  (15   → TOP 10)
//            ↳ RIASEC Hexagon Penalty (dist=3 → ×0.20; dist=2 → ×0.70)
//            ↳ MBTI Compatibility Score
//            ↳ Ikigai Talent Bonus: CRAFT (+15/×0.30), SPEECH/STRATEGY (+15/+5)
//            ↳ Dream + Holland Cross-check (+20 full / +8 partial)
//  VÒNG 3 — Tối ưu Xu hướng & Dòng tiền  (10   → TOP 5 )
//            ↳ Theory Penalty (×0.60 nếu lý thuyết thuần + demand<75)
//            ↳ Diversity Guard (≤2 ngành cùng industry trong TOP 5)
//            ↳ Display branching: Dưới lớp 12 / Đại học
// ============================================================================
async function generateReportUI() {
  const profile = JSON.parse(localStorage.getItem("active_student_profile"));
  const answers = JSON.parse(localStorage.getItem("user_quiz_answers"));

  if (!profile || !answers) {
    alert("Không tìm thấy dữ liệu. Vui lòng làm lại từ đầu!");
    return;
  }

  try {
    const res = await fetch('data/careers_matrix.json?v=' + new Date().getTime());
    const database = await res.json();
    const careers = database.careers || [];

    // ══════════════════════════════════════════════════════════════════════════
    //  PHÂN HỆ A — NHÂN SỐ HỌC PYTHAGORAS
    //  Tính 5 chỉ số: Tiềm năng, Khát vọng, Sứ mệnh, Tài năng, Đam mê
    // ══════════════════════════════════════════════════════════════════════════

    // Bảng chuyển đổi chữ cái tiếng Anh sang số (Pythagoras)
    const LETTER_MAP = {
      A: 1, J: 1, S: 1, B: 2, K: 2, T: 2, C: 3, L: 3, U: 3,
      D: 4, M: 4, V: 4, E: 5, N: 5, W: 5, F: 6, O: 6, X: 6,
      G: 7, P: 7, Y: 7, H: 8, Q: 8, Z: 8, I: 9, R: 9
    };
    const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

    // Chuẩn hóa tên tiếng Việt → ký tự Latin hoa
    const toLatinUpper = (text) => {
      const VM = {
        A: 'ÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ',
        E: 'ÉÈẺẼẸÊẾỀỂỄỆ',
        I: 'ÍÌỈĨỊ',
        O: 'ÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ',
        U: 'ÚÙỦŨỤƯỨỪỬỮỰ',
        Y: 'ÝỲỶỸY',
        D: 'Đ'
      };
      let s = text.toUpperCase();
      for (const base in VM)
        for (const c of VM[base])
          s = s.split(c).join(base);
      return s.replace(/[^A-Z\s]/g, '');
    };

    // Rút gọn số — giữ số chủ 11, 22, 33 nếu keepMaster = true
    const reduceNum = (n, keepMaster = false) => {
      while (n > 9) {
        if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
        n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
      }
      return n;
    };

    // — Tiềm năng (Lifepath): toàn bộ chữ số ngày/tháng/năm sinh —
    const allDigits = profile.birthDate.replace(/\D/g, '').split('').map(Number);
    const dayDigits = (profile.birthDate.split('/')[0] || '').replace(/\D/g, '').split('').map(Number);
    const lifepathNum = reduceNum(allDigits.reduce((a, b) => a + b, 0), true);
    const talentNum = reduceNum(dayDigits.reduce((a, b) => a + b, 0));

    // — Sứ mệnh, Khát vọng, Đam mê: từ họ tên đầy đủ —
    const latinName = toLatinUpper(profile.fullName);
    let soulRaw = 0, missionRaw = 0, letterFreq = {};

    latinName.split(' ').forEach(word => {
      for (const ch of word) {
        const v = LETTER_MAP[ch];
        if (!v) continue;
        missionRaw += v;
        letterFreq[v] = (letterFreq[v] || 0) + 1;
        if (VOWELS.has(ch)) soulRaw += v;
      }
    });

    const soulNum = reduceNum(soulRaw, true);   // Khát vọng / Linh hồn
    const missionNum = reduceNum(missionRaw, true); // Sứ mệnh

    // Đam mê: tất cả số xuất hiện NHIỀU NHẤT trong tên (có thể nhiều hơn 1 nếu đồng hạng)
    const maxLetterFreq = Object.keys(letterFreq).length
      ? Math.max(...Object.values(letterFreq))
      : 0;
    const passionNums = maxLetterFreq > 0
      ? Object.keys(letterFreq)
        .filter(k => letterFreq[k] === maxLetterFreq)
        .map(Number)
        .sort((a, b) => a - b)   // Sắp xếp tăng dần để hiển thị đẹp
      : [5];

    // 4 key đơn tra num_mapping + trọng số (Passion tính riêng bên dưới)
    const NUM_KEYS = [
      String(lifepathNum), // Tiềm năng  ×0.35
      String(soulNum),     // Khát vọng  ×0.25
      String(missionNum),  // Sứ mệnh    ×0.20
      String(talentNum),   // Tài năng   ×0.10
    ];
    const NUM_W = [0.35, 0.25, 0.20, 0.10]; // Tổng 4 chỉ số = 0.90; Passion bù 0.10

    // ══════════════════════════════════════════════════════════════════════════
    //  PHÂN HỆ B — HOLLAND & MBTI
    // ══════════════════════════════════════════════════════════════════════════
    const MBTI_MAP = {
      Q_M1: { A: 'E', B: 'I' }, Q_M2: { A: 'E', B: 'I' }, Q_M3: { A: 'E', B: 'I' },
      Q_M4: { A: 'S', B: 'N' }, Q_M5: { A: 'S', B: 'N' }, Q_M6: { A: 'S', B: 'N' },
      Q_M7: { A: 'T', B: 'F' }, Q_M8: { A: 'T', B: 'F' }, Q_M9: { A: 'T', B: 'F' },
      Q_M10: { A: 'J', B: 'P' }, Q_M11: { A: 'J', B: 'P' }, Q_M12: { A: 'J', B: 'P' }
    };
    const RIASEC_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];

    // Khoảng cách hexagon RIASEC (tối đa 3)
    const hollandDistance = (a, b) => {
      const ia = RIASEC_ORDER.indexOf(a);
      const ib = RIASEC_ORDER.indexOf(b);
      if (ia < 0 || ib < 0) return 0;
      const diff = Math.abs(ia - ib);
      return Math.min(diff, 6 - diff);
    };

    let hScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    let hCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    let mbtiDim = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    for (const qId in answers) {
      const val = answers[qId];
      if (MBTI_MAP[qId]) {
        if (MBTI_MAP[qId][val]) mbtiDim[MBTI_MAP[qId][val]]++;
      } else if (!qId.includes('IKIGAI')) {
        const cat = qId.replace(/Q_([RIASEC]).*/, '$1');
        if (hScores[cat] !== undefined) {
          hScores[cat] += parseInt(val) || 0;
          hCounts[cat]++;
        }
      }
    }

    // % Holland (0–100); fallback nếu chưa làm
    let hPct = {};
    let isHollandEmpty = true;
    for (const cat in hScores) {
      hPct[cat] = (hScores[cat] / (hCounts[cat] * 5 || 1)) * 100;
      if (hScores[cat] > 0) isHollandEmpty = false;
    }
    if (isHollandEmpty) hPct = { R: 25, I: 40, A: 85, S: 90, E: 75, C: 35 };

    const mbtiCode = [
      mbtiDim.E >= mbtiDim.I ? 'E' : 'I',
      mbtiDim.S >= mbtiDim.N ? 'S' : 'N',
      mbtiDim.T >= mbtiDim.F ? 'T' : 'F',
      mbtiDim.J >= mbtiDim.P ? 'J' : 'P'
    ].join('');

    const sortedHolland = Object.entries(hPct).sort((a, b) => b[1] - a[1]);
    const userTop1Holland = sortedHolland[0][0];
    const userTop2Holland = sortedHolland[1][0];

    // ══════════════════════════════════════════════════════════════════════════
    //  PHÂN HỆ C — IKIGAI TALENT (Q_IKIGAI_TALENT_1 / _2 / _3)
    //  SPEECH=1 (ngôn từ), STRATEGY=2 (chiến lược/tâm lý), CRAFT=3 (thực hành)
    // ══════════════════════════════════════════════════════════════════════════
    const ikigaiTalent = {
      SPEECH: parseInt(answers["Q_IKIGAI_TALENT_1"]) || 3,
      STRATEGY: parseInt(answers["Q_IKIGAI_TALENT_2"]) || 3,
      CRAFT: parseInt(answers["Q_IKIGAI_TALENT_3"]) || 3
    };
    const dreamText = (answers["Q_IKIGAI_DREAM"] || "").toLowerCase().trim();

    // Regex phân loại đặc tính ngành nghề
    // RE_SPEECH_DOMAIN: nghề mà KỸ NĂNG NGÔN Từ / DẠY / TƯ VẤN là cốt lõi
    // Ghi chú: truyền thông (media), báo chí được tính bình thường theo Holland Score
    const RE_CRAFT_DOMAIN = /kỹ thuật|cơ khí|xây dựng|thủ công|lắp đặt|vận hành|chế tạo|thợ|spa|ẩm thực|bếp|nail|make.?up|barista|cắt tóc|massage|sửa chữa|điện lạnh/i;
    const RE_SPEECH_DOMAIN = /giảng dạy|đào tạo viên|huấn luyện viên|hướng dẫn|tư vấn|coach|khai vấn|diễn giả|speaker|thuyết trình|giảng viên|giáo viên|hướng nghiệp|tham vấn|mc chương trình/i;
    const RE_STRATEGY_DOMAIN = /quản trị|chiến lược|phân tích|kế hoạch|tâm lý|nghiên cứu|khai vấn|tư vấn|marketing|thương hiệu|consultant|advisor|strategy|brand/i;
    const RE_THEORY_PENALTY = /ngôn ngữ học|văn học thuần|triết học|toán học thuần|vật lý lý thuyết|hóa học thuần|sinh học thuần|lý thuyết thuần/i;

    // ══ INTENT MAPPING — ĐỐI CHIẾU Ý ĐỊNH SÂU ═══════════════════════════════
    //  Giải mã ước mơ thành tí n hiệu ý định rõ ràng:
    //  BIZ   = muốn làm kinh doanh / khởi nghiệp
    //  INSPIRE = muốn truyền cảm hứng / đào tạo / hướng nghiệp
    //  Điều kiện khớp dream: Holland của ngành phải vượt ngưỡng cụ thể
    // ══════════════════════════════════════════════════════════════════
    const BIZ_KEYWORDS = ['doanh nhân', 'kinh doanh', 'giám đốc', 'chủ tịch', 'startup', 'ceo', 'khởi nghiệp', 'founder', 'tự kinh doanh'];
    const INSPIRE_KEYWORDS = ['truyền cảm hứng', 'huấn luyện viên', 'đào tạo', 'điễn giả', 'tư vấn', 'giáo viên', 'khai vấn', 'coach', 'speaker', 'hướng nghiệp'];
    const CARE_KEYWORDS = ['bác sĩ', 'y tế', 'sức khỏe', 'chăm sóc', 'chữ a lành bệnh', 'tâm lý học', 'trị liệu'];
    const TECH_KEYWORDS = ['lập trình', 'công nghệ', 'kỹ sư', 'developer', 'data', 'ai', 'robot', 'phần mềm'];

    const hasBiz = BIZ_KEYWORDS.some(k => dreamText.includes(k));
    const hasInspire = INSPIRE_KEYWORDS.some(k => dreamText.includes(k));
    const hasCare = CARE_KEYWORDS.some(k => dreamText.includes(k));
    const hasTech = TECH_KEYWORDS.some(k => dreamText.includes(k));

    // Dominant talent dùng cho fallback
    const dominantTalent =
      (ikigaiTalent.SPEECH >= 4 || ikigaiTalent.STRATEGY >= 4) ? 'SPEECH_STRATEGY'
        : (ikigaiTalent.CRAFT >= 4) ? 'CRAFT'
          : 'GENERAL';



    // ══════════════════════════════════════════════════════════════════════════
    //  PHÂN HỆ D — ĐIỂM THPT & LỘ TRÌNH
    // ══════════════════════════════════════════════════════════════════════════
    const hasScores = profile.thptScores &&
      Object.values(profile.thptScores).some(v => v > 0);

    let ieltsBonus = 0;
    let finalUserScore = 0;
    let bestComboName = 'N/A';

    if (hasScores) {
      if (profile.languageCertification?.type === 'IELTS') {
        const iScore = parseFloat(profile.languageCertification.score) || 0;
        if (iScore >= 7.5) ieltsBonus = 2.0;
        else if (iScore >= 6.5) ieltsBonus = 1.5;
        else if (iScore >= 5.5) ieltsBonus = 1.0;
      }
      const s = profile.thptScores;
      const combos = {
        A00: s.toan + s.ly + s.hoa,
        A01: s.toan + s.ly + s.anh,
        B00: s.toan + s.hoa + s.sinh,
        C00: s.van + s.su + s.dia,
        D01: s.toan + s.van + s.anh
      };
      bestComboName = Object.keys(combos).reduce((a, b) => combos[a] >= combos[b] ? a : b);
      finalUserScore = Math.min(30.0, combos[bestComboName] + ieltsBonus);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  VÒNG 1 — SÀNG LỌC BẢN NGÃ TỐ CHẤT THUẦN TÚY (1001 → TOP 15)
    //  Chỉ dùng num_mapping + 5 chỉ số Nhân số học
    //  S_identity = LP×0.35 + Soul×0.25 + Mission×0.20 + Talent×0.10 + Passion×0.10
    //  (num_mapping value 1–10) × 10 → thang 0–100
    // ══════════════════════════════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════════════════════════
    //  PRE-FILTER — NĂNG KHIẾU CỨNG: Loại hẳn khỏi pool nếu thiếu điều kiện
    //  Lý do: ×0.30 penalty chỉ ảnh hưởng S_niche (25%), không đủ mạnh để
    //  đẩy nghề nghệ thuật/vẽ/biểu diễn ra khỏi TOP 5 khi S_identity (60%)
    //  vẫn cao. Giải pháp đúng: loại TRƯỚC KHI tính điểm.
    // ═══════════════════════════════════════════════════════════════════════

    // Các ngành đòi hỏi NĂNG KHIẾU VẼ / NGHỆ THUẬT / BIỂU DIỄN bẩm sinh
    const RE_ARTS_HARD = /thiết kế đồ họa|thiết kế nội thất|thiết kế thời trang|thiết kế sản phẩm mỹ|mỹ thuật|họa sĩ|điêu khắc|vẽ tranh|tranh sơn dầu|diễn viên|ca sĩ|nhạc sĩ|nhạc cụ|nhạc viện|vũ công|múa|ballet|sân khấu kịch|nghệ thuật biểu diễn|biên đạo|đạo diễn sân khấu|animation|concept art|illustration|game art|comic|manga/i;

    // Lọc pool đầu vào dựa trên tự đánh giá năng khiếu của người dùng
    const candidateCareers = (ikigaiTalent.CRAFT <= 2)
      ? careers.filter(c => !RE_ARTS_HARD.test(c.name.toLowerCase()))
      : careers;

    const round1 = candidateCareers

      .map(c => {
        let S_identity = 0;
        // 4 chỉ số đơn (LP, Soul, Mission, Talent)
        NUM_KEYS.forEach((key, idx) => {
          const mapped = c.num_mapping?.[key] ?? 5;
          S_identity += (mapped / 10) * 100 * NUM_W[idx];
        });
        // Đam mê: trung bình cộng của TẤT CẢ passion numbers đồng hạng (×0.10)
        const passionAvgScore = passionNums.reduce((sum, pn) =>
          sum + (c.num_mapping?.[String(pn)] ?? 5), 0
        ) / passionNums.length;
        S_identity += (passionAvgScore / 10) * 100 * 0.10;

        return { c, S_identity: +S_identity.toFixed(4) };
      })
      .sort((a, b) => b.S_identity - a.S_identity)
      .slice(0, 20); // Mở rộng pool: TOP 20 → VÒNG 2 (tăng từ 15 để không bỏ sót ngành phù hợp)

    // ══════════════════════════════════════════════════════════════════════════
    //  VÒNG 2 — ĐỊNH VỊ MÔI TRƯỜNG, NGÁCH & KỸ NĂNG (20 → TOP 10)
    //
    //  S_niche_base = Holland×0.55 + MBTI×0.35
    //  → RIASEC Hexagon Penalty: dist=3 → ×0.20 | dist=2 (cả 2) → ×0.70
    //  → IKIGAI CRAFT Bonus/Penalty
    //  → IKIGAI SPEECH/STRATEGY Bonus
    //  → Dream + Holland Cross-check Bonus
    // ══════════════════════════════════════════════════════════════════════════
    const round2 = round1
      .map(({ c, S_identity }) => {
        const nameLC = c.name.toLowerCase();

        // ── Holland Weighted Score ──────────────────────────────────────────
        let hNum = 0, hDen = 0;
        for (const cat in (c.holland_req || {})) {
          hNum += hPct[cat] * c.holland_req[cat];
          hDen += 100 * c.holland_req[cat];
        }
        let hollandScore = hDen > 0 ? (hNum / hDen) * 100 : 50;

        // ── RIASEC Hexagon Penalty ──────────────────────────────────────────
        const careerTopH = Object.entries(c.holland_req || {})
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'S';
        const dist1 = hollandDistance(userTop1Holland, careerTopH);
        const dist2 = hollandDistance(userTop2Holland, careerTopH);

        if (dist1 === 3 || dist2 === 3) {
          hollandScore *= 0.20;       // Đối kháng trực tiếp: phạt 80%
        } else if (dist1 === 2 && dist2 >= 2) {
          hollandScore *= 0.70;       // Lệch pha vừa: phạt 30%
        }

        // ── MBTI Compatibility ──────────────────────────────────────────────
        let mbtiBase = 60;
        for (const letter of mbtiCode) {
          if (c.mbti_req?.[letter]) mbtiBase += c.mbti_req[letter] * 6;
        }
        const mbtiScore = Math.max(0, Math.min(100, mbtiBase));

        // ── S_niche nền tảng (Holland 55% + MBTI 35%) ──────────────────────
        let S_niche = (hollandScore * 0.55) + (mbtiScore * 0.35);

        // ══════════════════════════════════════════════════════════════════
        //  IKIGAI TALENT BONUS — ĐẦY ĐỦ 3 CHIỀU + ARTS GATE
        // ══════════════════════════════════════════════════════════════════

        // [1a] CRAFT — Thực hành tay chân cơ học (Holland R mạnh hoặc ngành thủ công)
        const isCraftCareer = RE_CRAFT_DOMAIN.test(nameLC) || (c.holland_req?.R || 0) >= 6;
        if (isCraftCareer) {
          if (ikigaiTalent.CRAFT >= 4) {
            S_niche = Math.min(100, S_niche + 15); // Năng khiếu thực hành mạnh ✓
          } else if (ikigaiTalent.CRAFT <= 2) {
            S_niche *= 0.30; // Không phù hợp tay nghề ✗
          }
        }

        // [1b] ARTS GATE — Nghề đòi hỏi NĂNG KHIẾU NGHỆ THUẬT / VẼ / BIỂU DIỄN
        //  Khác với CRAFT cơ học — đây là nhóm cần tài năng sáng tạo bẩm sinh:
        //  Thiết kế đồ họa (cần biết vẽ), Diễn viên, Ca sĩ, Nhạc sĩ, Vũ công...
        //  → Nếu người dùng tự đánh giá CRAFT thấp (1-2): phạt nặng
        //  → Nếu CRAFT cao (4-5) hoặc Holland A mạnh: thưởng
        const RE_ARTS_DOMAIN = /thiết kế đồ họa|mỹ thuật|họa sĩ|điêu khắc|vẽ tranh|tranh|diễn viên|ca sĩ|nhạc sĩ|nhạc cụ|nhạc viện|vũ công|múa|ballet|sân khấu kịch|nghệ thuật biểu diễn|biên đạo|đạo diễn sân khấu|phim hoạt hình|concept art|game art|illustration|nhiếp ảnh nghệ thuật/i;
        const isArtsCareer = RE_ARTS_DOMAIN.test(nameLC) ||
          ((c.holland_req?.A || 0) >= 7 && (c.holland_req?.R || 0) < 4);

        if (isArtsCareer && !isCraftCareer) { // Tránh tính 2 lần
          if (ikigaiTalent.CRAFT <= 2) {
            S_niche *= 0.30; // Không có năng khiếu nghệ thuật → loại khỏi top ✗
          } else if (ikigaiTalent.CRAFT >= 4) {
            S_niche = Math.min(100, S_niche + 12); // Năng khiếu nghệ thuật mạnh ✓
          }
        }

        // [2] SPEECH — Ngôn từ, truyền đạt, đào tạo
        const isSpeechCareer = RE_SPEECH_DOMAIN.test(nameLC);
        // [3] STRATEGY — Chiến lược, tâm lý, tư vấn
        const isStrategyCareer = RE_STRATEGY_DOMAIN.test(nameLC);

        if (isSpeechCareer || isStrategyCareer) {
          if (ikigaiTalent.SPEECH >= 4 || ikigaiTalent.STRATEGY >= 4) {
            S_niche = Math.min(100, S_niche + 15); // Ưu thế ngôn từ/chiến lược
          }
          // Cộng dồn nếu cả hai đều mạnh (chuyên gia đỉnh cao)
          if (ikigaiTalent.SPEECH >= 4 && ikigaiTalent.STRATEGY >= 4) {
            S_niche = Math.min(100, S_niche + 5);
          }
        }


        // ══════════════════════════════════════════════════════════════════
        //  DREAM ALIGNMENT — INTENT MAPPING
        //  Đối chiếu ý định sâu:
        //  BIZ + INSPIRE → khớp ngành có S≥85 và E≥80 (Lãnh đạo xã hội + Kinh doanh)
        //  BIZ only     → khớp ngành có E≥80
        //  INSPIRE only → khớp ngành có S≥80
        //  CARE only    → khớp ngành có S≥80 trong Y tế/Tâm lý
        //  TECH only    → khớp ngành có I≥75 hoặc R≥75
        // ══════════════════════════════════════════════════════════════════
        let dreamBonus = 0;
        let isDreamMatch = false;

        if (dreamText.length > 0) {
          const careerS = c.holland_req?.S || 0;
          const careerE = c.holland_req?.E || 0;
          const careerI = c.holland_req?.I || 0;
          const careerR = c.holland_req?.R || 0;

          if (hasBiz && hasInspire) {
            // "Dấu ấn định vị khớp đỉnh": doanh nhân + truyền cảm hứng
            // Chỉ khớp ngành có cả 2 chiều: Xã hội (S) và Kinh doanh (E)
            if (careerS >= 85 && careerE >= 80) {
              dreamBonus = 20; isDreamMatch = true;
            } else if (careerS >= 70 && careerE >= 70) {
              dreamBonus = 12; isDreamMatch = true;
            }
          } else if (hasBiz) {
            if (careerE >= 80) { dreamBonus = 15; isDreamMatch = true; }
            else if (careerE >= 65) { dreamBonus = 8; }
          } else if (hasInspire) {
            if (careerS >= 80) { dreamBonus = 15; isDreamMatch = true; }
            else if (careerS >= 65) { dreamBonus = 8; }
          } else if (hasCare) {
            const isMedOrPsy = /y tế|y khoa|dược|chăm sóc|tâm lý|tham vấn|điều dưỡng/i.test(nameLC);
            if (isMedOrPsy && careerS >= 75) { dreamBonus = 15; isDreamMatch = true; }
          } else if (hasTech) {
            if (careerI >= 75 || careerR >= 75) { dreamBonus = 15; isDreamMatch = true; }
          }

          S_niche = Math.min(100, S_niche + dreamBonus);
        }

        S_niche = Math.max(0, +S_niche.toFixed(4));

        return { c, S_identity, S_niche, dreamBonus, isDreamMatch, careerTopH };
      })
      .sort((a, b) => b.S_niche - a.S_niche)
      .slice(0, 10);

    // ══════════════════════════════════════════════════════════════════════════
    //  VÒNG 3 — TỐI ƯU XU HƯỚNG & GIÁ TRỊ DÒNG TIỀN (10 → TOP 5)
    //  S_market = demand×0.55 + salary×0.45
    //  ICI = S_identity×0.60 + S_niche×0.25 + S_market×0.15
    //  + Theory Penalty + Bucket Classification
    // ══════════════════════════════════════════════════════════════════════════
    const round3 = round2
      .map(({ c, S_identity, S_niche, dreamBonus, isDreamMatch, careerTopH }) => {
        const demand = c.market_demand ?? 50;
        const salary = c.market_salary ?? 50;

        // Hệ số phạt lý thuyết thuần bão hòa (demand < 75)
        const theoryPenalty = RE_THEORY_PENALTY.test(c.name) && demand < 75 ? 0.60 : 1.0;
        const S_market = (demand * theoryPenalty * 0.55) + (salary * theoryPenalty * 0.45);

        // Công thức ICI 3 lớp cốt lõi
        const ICI = Math.min(100,
          (S_identity * 0.60) +
          (S_niche * 0.25) +
          (S_market * 0.15)
        );

        // Điểm chuẩn tham chiếu mô phỏng
        const mockCutoff = Math.round((20.0 + (demand / 100) * 9.5) * 100) / 100;
        let bucket = 'PHÙ HỢP';
        let advice = 'Ngành ứng dụng thực tế có chỉ số tương thích bẩm sinh xuất sắc.';

        if (hasScores) {
          const delta = Math.round((finalUserScore - mockCutoff) * 100) / 100;
          if (delta >= 1.5) { bucket = 'SAFE'; advice = 'Phao cứu sinh an toàn tuyệt đối — bệ đỡ tâm lý vững chắc.'; }
          else if (delta >= 0) { bucket = 'MATCH'; advice = 'Vừa tầm, cơ hội đỗ cực kỳ cao — nên đặt giữa danh sách nguyện vọng.'; }
          else if (delta >= -1.2) { bucket = 'DREAM'; advice = 'Nguyện vọng mơ ước, điểm sát nút — đặt ở NV1 hoặc NV2.'; }
          else { bucket = 'RISK'; advice = 'Điểm chuẩn vượt xa năng lực hiện tại — cân nhắc kỹ trước khi đặt.'; }
        }

        // Tổ hợp môn & kiến thức nền tảng (fallback thông minh)
        let displayCombo = c.suggested_combinations || '';
        let displaySubjects = c.core_knowledge || '';
        if (!displayCombo) {
          const nm = c.name.toLowerCase();
          if (/thiết kế đồ họa|mỹ thuật|hội họa|nhiếp ảnh|hoạt hình|animation|nội thất|thời trang/i.test(nm)) {
            displayCombo = 'H01 / V01 (Toán - Văn - Vẽ Mỹ thuật)';
            displaySubjects = 'Hình họa khối, Bố cục màu sắc, Tư duy thẩm mỹ thị giác, Đồ họa kỹ thuật số.';
          } else if (/diễn viên|âm nhạc|thanh nhạc|múa|biên đạo|sân khấu|kịch/i.test(nm)) {
            displayCombo = 'N00 / N01 (Năng khiếu Âm nhạc / Sân khấu / Múa)';
            displaySubjects = 'Kỹ thuật thanh nhạc, Biểu diễn sân khấu, Ngôn ngữ cơ thể, Cảm thụ nghệ thuật.';
          } else if (/truyền thông|marketing|báo chí|pr|quảng cáo/i.test(nm)) {
            displayCombo = 'D01 / C00 (Toán - Văn - Anh / Văn - Sử - Địa)';
            displaySubjects = 'Kỹ năng viết lách sáng tạo, Tư duy truyền thông số, Ngôn ngữ, Quan hệ công chúng.';
          } else if (careerTopH === 'R' || careerTopH === 'I') {
            displayCombo = 'A00 / B00 (Toán - Lý - Hóa / Toán - Hóa - Sinh)';
            displaySubjects = 'Tư duy logic toán, Khoa học tự nhiên, Kỹ thuật ứng dụng, Lập trình nền tảng.';
          } else {
            displayCombo = 'D01 / C00 (Toán - Văn - Anh / Văn - Sử - Địa)';
            displaySubjects = 'Khoa học xã hội, Ngôn ngữ, Kỹ năng giao tiếp thuyết phục, Quản trị nền tảng.';
          }
        }

        return {
          name: c.name,
          niche: c.niche || c.name,
          industry: c.industry || '',
          study_major: c.study_major || '',
          ICI: +ICI.toFixed(2),
          S_identity: +S_identity.toFixed(1),
          S_niche: +S_niche.toFixed(1),
          S_market: +S_market.toFixed(1),
          cutoff: mockCutoff,
          bucket,
          advice,
          dreamBonus,
          isDreamMatch,
          displayCombo,
          displaySubjects,
          numerology_peak: c.numerology_peak || null
        };
      })
      .sort((a, b) => b.ICI - a.ICI);

    // ── Diversity Guard: tối đa 2 ngành cùng industry trong TOP 5 ──────────
    const industryCount = {};
    const top5 = [];
    for (const entry of round3) {
      if (top5.length >= 5) break;
      const ind = entry.industry || 'other';
      if ((industryCount[ind] || 0) >= 2) continue;
      industryCount[ind] = (industryCount[ind] || 0) + 1;
      top5.push(entry);
    }
    // Bù thiếu nếu filter lọc quá nhiều
    for (const entry of round3) {
      if (top5.length >= 5) break;
      if (!top5.includes(entry)) top5.push(entry);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  ĐỔ DỮ LIỆU LÊN GIAO DIỆN
    // ══════════════════════════════════════════════════════════════════════════
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('report-container').classList.remove('hidden');

    // — Header —
    const contactInfo = [
      profile.email ? `📧 ${profile.email}` : '',
      profile.phone ? `📱 ${profile.phone}` : ''
    ].filter(Boolean).join('  ·  ');

    document.getElementById('report-student-name').innerHTML =
      `Báo cáo Định vị Ikigai Chiến lược cho: <strong>${profile.fullName}</strong>`
      + (contactInfo ? `<br><span style="font-size:13px;color:#718096;font-weight:400;">${contactInfo}</span>` : '');


    // — 5 chỉ số Nhân số học —
    document.getElementById('res-lifepath').innerText = lifepathNum;
    document.getElementById('res-soul').innerText = soulNum;
    document.getElementById('res-mission').innerText = missionNum;
    document.getElementById('res-talent').innerText = talentNum;
    document.getElementById('res-passion').innerText = passionNums.join(' & ');
    document.getElementById('res-mbti').innerText = mbtiCode;
    document.getElementById('res-holland').innerText = sortedHolland.slice(0, 2).map(x => x[0]).join(' & ');

    // — Điểm xét tuyển / Chế độ —
    const scoreEl = document.getElementById('res-score');
    if (!hasScores) {
      scoreEl.innerText = 'Chế độ: Hướng nghiệp sớm (Dưới lớp 12)';
    } else {
      scoreEl.innerText = `${finalUserScore.toFixed(2)} (Khối ${bestComboName})`;
    }

    // — Banner lộ trình —
    const bannerEl = document.getElementById('vocational-route-banner');
    const titleEl = document.getElementById('career-section-title');

    if (!hasScores) {
      titleEl.innerText = '🌟 TOP 5 HƯỚNG ĐI TIỀM NĂNG & TỔ HỢP MÔN CẦN CHUẨN BỊ';
      bannerEl.innerHTML = `
        <div style="background:linear-gradient(135deg,#276749,#2f855a);border-radius:12px;
          padding:16px 20px;margin-bottom:22px;color:#fff;border-left:5px solid #68d391;">
          <h4 style="color:#68d391;margin:0 0 8px;font-size:15px;">📚 CHẾ ĐỘ HƯỚNG NGHIỆP SỚM — XÂY BỆ PHÓNG NGAY TỪ BÂY GIỜ</h4>
          <p style="margin:0;font-size:14px;line-height:1.75;">
            Hệ thống gợi ý <strong>tổ hợp môn &amp; kiến thức nền tảng</strong> THPT cần xây dựng
            sớm để làm bệ phóng vững chắc cho từng ngách ngành cụ thể.
          </p>
        </div>`;
    } else {
      titleEl.innerText = '🌟 TOP 5 NGUYỆN VỌNG VÀNG ĐƯỢC GỢI Ý';
      bannerEl.innerHTML = '';
    }

    // — Màu sắc & nhãn bucket —
    const BUCKET_COLOR = {
      DREAM: '#805ad5', MATCH: '#3182ce', SAFE: '#38a169', RISK: '#e53e3e', 'PHÙ HỢP': '#3182ce'
    };
    const BUCKET_CLASS = {
      DREAM: 'bucket-dream', MATCH: 'bucket-match', SAFE: 'bucket-safe', RISK: 'bucket-risk', 'PHÙ HỢP': 'bucket-match'
    };

    // ── Render 5 thẻ kết quả ──────────────────────────────────────────────────
    const space = document.getElementById('career-recommendations-space');
    space.innerHTML = '';

    top5.forEach((entry, idx) => {
      const card = document.createElement('div');
      card.className = 'career-card';
      card.style.borderLeftColor = BUCKET_COLOR[entry.bucket] || '#3182ce';

      // ICI breakdown badge
      const iciBreakdown = `<small style="color:#718096;font-size:11px;">
        (Id:${entry.S_identity} · Ni:${entry.S_niche} · Mk:${entry.S_market})</small>`;

      // Dream badge — chỉ hiện khi isDreamMatch = true (Holland đủ ngưỡng cụ thể)
      const dreamBadge = entry.isDreamMatch
        ? `<span style="background:#faf089;color:#744210;font-size:11px;padding:2px 8px;
            border-radius:99px;font-weight:700;margin-left:6px;">✨ Khớp Ước Mơ</span>`
        : '';

      // Numerology peak badge
      const peakBadge = entry.numerology_peak
        ? `<span style="background:#e9d8fd;color:#553c9a;font-size:10px;padding:2px 7px;
            border-radius:99px;margin-left:5px;">🔢 Ngách Số học Đỉnh</span>`
        : '';

      // Industry tag
      const industryTag = entry.industry
        ? `<div style="padding:4px 0 0 2px;font-size:12px;color:#718096;">— ${entry.industry}</div>`
        : '';

      // Study major tag — ngành học cần theo đuổi
      const studyMajorTag = entry.study_major
        ? `<div style="display:inline-flex;align-items:center;gap:6px;margin-top:6px;
            padding:5px 12px;background:linear-gradient(135deg,#ebf4ff,#e6fffa);
            border:1px solid #bee3f8;border-radius:8px;font-size:12px;color:#2c5282;"
           title="Ngành học đại học phù hợp để làm nghề này">
            🎓 <strong>Ngành học:</strong>&nbsp;${entry.study_major}
          </div>`
        : '';

      // Nội dung chi tiết — phân nhánh động theo đối tượng
      let detailsHTML = '';
      let footerNote = '';

      if (!hasScores) {
        // ── CHẾ ĐỘ DƯỚI LỚP 12 ───────────────────────────────────────────
        //    Ẩn điểm chuẩn & trường ĐH
        //    Hiện: tổ hợp môn + khối kiến thức nền tảng THPT
        detailsHTML = `
          <span>Độ tương thích ICI: <strong>${entry.ICI}%</strong> ${iciBreakdown}</span>
          <span>Tổ hợp môn cần chuẩn bị: <strong>${entry.displayCombo}</strong></span>
          <span>Xu hướng thị trường: <strong>${entry.S_market >= 70 ? 'Cao ⚡' : 'Ổn định'}</strong></span>`;
        footerNote = `
          <div style="margin-top:8px;padding:10px 14px;background:#ebf8ff;border-radius:8px;
            font-size:13px;color:#2b6cb0;line-height:1.65;">
            📖 <strong>Khối kiến thức & kỹ năng nền tảng THPT cần xây dựng sớm:</strong><br>
            ${entry.displaySubjects}
          </div>`;
      } else {
        // ── CHẾ ĐỘ ĐẠI HỌC ──────────────────────────────────────────────
        //    Hiển thị đầy đủ điểm chuẩn, tổ hợp môn, kiến thức trọng tâm
        detailsHTML = `
          <span>Độ tương thích ICI: <strong>${entry.ICI}%</strong> ${iciBreakdown}</span>
          <span>Điểm sàn tham chiếu: <strong>${entry.cutoff}</strong></span>
          <span>Điểm xét tuyển của bạn: <strong>${finalUserScore.toFixed(2)}</strong></span>
          <span>Tổ hợp môn gợi ý: <strong>${entry.displayCombo}</strong></span>`;
        footerNote = `
          <div style="margin-top:8px;padding:10px 14px;background:#f0fff4;border-radius:8px;
            font-size:13px;color:#276749;line-height:1.65;">
            📖 <strong>Kiến thức & kỹ năng trọng tâm:</strong><br>
            ${entry.displaySubjects}
          </div>`;
      }

      card.innerHTML = `
        <div class="career-header">
          <span class="career-title">${idx + 1}. ${entry.niche}${dreamBadge}${peakBadge}</span>
          <span class="bucket-tag ${BUCKET_CLASS[entry.bucket] || 'bucket-match'}">${entry.bucket}</span>
        </div>
        ${industryTag}
        ${studyMajorTag}
        <div class="career-details">${detailsHTML}</div>
        ${footerNote}
        <div class="career-advice">⚡ Lời khuyên chiến thuật: ${entry.advice}</div>`;

      space.appendChild(card);
    });

  } catch (err) {
    console.error('Lỗi thực thi Universal Layered Algorithm v5.0:', err);
    alert('Đã xảy ra sự cố trong quá trình phân tích ma trận. Vui lòng thử lại!');
  }
}