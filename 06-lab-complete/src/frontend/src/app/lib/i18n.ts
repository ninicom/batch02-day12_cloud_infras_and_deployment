export type Lang = "en" | "vi";

export const i18n = {
  en: {
    badge: "TOP-RANKED IN SOUTHEAST ASIA",
    headline1: "Shape the Future",
    headline2: "with VinUniversity",
    sub: "Explore admissions, scholarships, tuition, and academic programs with our AI Admissions Assistant.",
    applyNow: "Apply Now",
    explorePrograms: "Explore Programs",
    stats: [
      { value: "8,000+", label: "Students Enrolled" },
      { value: "$12M+", label: "Scholarships Awarded" },
      { value: "120+", label: "Academic Programs" },
      { value: "#1", label: "Private Uni in Vietnam" },
    ],
    nav: ["Programs", "Scholarships", "Tuition", "Campus Life"],
    chatTitle: "AI Admissions Assistant",
    chatStatus: "Online · Powered by AI",
    expandChat: "Expand",
    greeting: {
      hello: "Hello! 👋",
      intro: "I am VinUni's Intelligent Admissions Assistant.",
      canHelp: "I can help you with:",
      topics: [
        "Tuition",
        "Scholarships",
        "Academic Programs",
        "Admission Requirements",
        "Application Procedures",
      ],
      cta: "Choose a topic below or type your question.",
    },
    quickReplies: ["Tuition", "Scholarships", "Programs"],
    placeholder: "Ask your question...",
    // FAQ flow
    faq: {
      userQuestion: "What are the admission requirements for Computer Science?",
      typingLabel: "Typing",
      aiResponse:
        "The Computer Science program requires academic transcripts, a personal essay, and an admissions interview.",
      chips: ["Program Tuition", "Scholarship Opportunities", "Application Process"],
    },
    backToHome: "Back to home",
    openFullChat: "Open full chat",
  },
  vi: {
    badge: "XẾP HẠNG CAO NHẤT ĐÔNG NAM Á",
    headline1: "Kiến Tạo Tương Lai",
    headline2: "cùng VinUniversity",
    sub: "Khám phá tuyển sinh, học bổng, học phí và chương trình đào tạo với Trợ lý Tuyển sinh AI.",
    applyNow: "Đăng Ký Ngay",
    explorePrograms: "Khám Phá Ngành Học",
    stats: [
      { value: "8.000+", label: "Sinh viên đang học" },
      { value: "12 triệu$+", label: "Học bổng đã trao" },
      { value: "120+", label: "Chương trình đào tạo" },
      { value: "#1", label: "ĐH tư thục tại VN" },
    ],
    nav: ["Ngành học", "Học bổng", "Học phí", "Đời sống sinh viên"],
    chatTitle: "Trợ lý Tuyển sinh AI",
    chatStatus: "Trực tuyến · Hỗ trợ bởi AI",
    expandChat: "Mở rộng",
    greeting: {
      hello: "Xin chào! 👋",
      intro: "Tôi là Trợ lý Tuyển sinh Thông minh của VinUni.",
      canHelp: "Tôi có thể hỗ trợ bạn về:",
      topics: [
        "Học phí",
        "Học bổng",
        "Ngành học",
        "Điều kiện tuyển sinh",
        "Hồ sơ xét tuyển",
      ],
      cta: "Hãy chọn một chủ đề bên dưới hoặc nhập câu hỏi của bạn.",
    },
    quickReplies: ["Học phí", "Học bổng", "Ngành học"],
    placeholder: "Nhập câu hỏi của bạn...",
    // FAQ flow
    faq: {
      userQuestion:
        "Điều kiện tuyển sinh ngành Khoa học Máy tính là gì?",
      typingLabel: "Đang nhập",
      aiResponse:
        "Ngành Khoa học Máy tính yêu cầu học bạ THPT, bài luận cá nhân và phỏng vấn tuyển sinh.",
      chips: ["Học phí ngành này", "Cơ hội học bổng", "Quy trình xét tuyển"],
    },
    backToHome: "Về trang chủ",
    openFullChat: "Mở chat đầy đủ",
  },
} as const;

export type I18nKeys = typeof i18n.en;
