import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Send, Bot, User, Sun, Moon, GraduationCap } from "lucide-react";
import campusHero from "../../imports/image.png";
import { i18n, type Lang } from "../lib/i18n";
import { ChatHeader } from "../components/ChatHeader";
import { ChatWidget } from "../components/ChatWidget";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialLang: Lang = (location.state as { lang?: Lang })?.lang ?? "en";

  const [lang, setLang] = useState<Lang>(initialLang);
  const [chatTheme, setChatTheme] = useState<"light" | "dark">(() => {
    const routeTheme = (location.state as { theme?: "light" | "dark" })?.theme;
    return routeTheme || (localStorage.getItem("chat_theme") as "light" | "dark") || "light";
  });

  const toggleChatTheme = () => {
    setChatTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("chat_theme", next);
      return next;
    });
  };

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem("chat_session_id");
    if (saved) return saved;
    const newId = crypto.randomUUID();
    localStorage.setItem("chat_session_id", newId);
    return newId;
  });
  const t = i18n[lang];

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: chatTheme === "dark" ? "#0f172a" : "#ffffff",
      }}
    >
      <nav
        className="relative z-20 flex items-center justify-between px-8 py-2.5 md:px-16 transition-all duration-300 shrink-0"
        style={{
          borderBottom: chatTheme === "dark" ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(11, 35, 65, 0.04)",
          background: chatTheme === "dark" ? "rgba(11, 35, 65, 0.15)" : "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "#C9A227" }}>
            <GraduationCap size={20} color="#0B2341" strokeWidth={2.2} />
          </div>
          <div>
            <span className="block leading-none transition-colors duration-300" style={{ color: chatTheme === "dark" ? "#fff" : "#1A202C", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>VinUniversity</span>
            <span className="block transition-colors duration-300" style={{ color: chatTheme === "dark" ? "rgba(201,162,39,0.85)" : "#3182CE", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em" }}>ADMISSIONS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 transition-all duration-200 hover:brightness-110 active:scale-95 px-3 py-1.5 rounded-lg text-sm font-semibold"
            style={{
              background: chatTheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(11,35,65,0.05)",
              border: `1.5px solid ${chatTheme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(11,35,65,0.15)"}`,
              cursor: "pointer",
              color: chatTheme === "dark" ? "#ffffff" : "#0B2341",
            }}
          >
            <ArrowLeft size={14} />
            {t.backToHome}
          </button>

          <LanguageSwitcher lang={lang} onLangChange={setLang} dark={chatTheme === "light"} />
          
          <button
            onClick={toggleChatTheme}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 active:scale-95 ${chatTheme === "dark" ? "hover:bg-white/10" : "hover:bg-slate-900/5"}`}
            style={{
              border: `1.5px solid ${chatTheme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(11,35,65,0.15)"}`,
              cursor: "pointer",
              color: chatTheme === "dark" ? "#ffffff" : "#0B2341",
              background: "none"
            }}
            title={chatTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {chatTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      {/* ── Main Content Split Panel ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Left Panel — campus background ── */}
        <div className="hidden lg:block relative flex-1 overflow-hidden" style={{ background: chatTheme === "dark" ? "transparent" : "#ffffff" }}>
          <img
            src={campusHero}
            alt="VinUniversity campus"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
            style={{
              filter: chatTheme === "light" ? "brightness(0.95)" : "none",
              opacity: chatTheme === "light" ? 0.45 : 1
            }}
          />
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: chatTheme === "dark"
                ? "linear-gradient(135deg, rgba(11,35,65,0.72) 0%, rgba(11,35,65,0.45) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(240,244,248,0.35) 100%)"
            }}
          />

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col justify-end p-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 self-start"
              style={{
                background: chatTheme === "dark" ? "rgba(201,162,39,0.2)" : "rgba(49,130,206,0.08)",
                border: chatTheme === "dark" ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(49,130,206,0.25)"
              }}
            >
              <span style={{ color: chatTheme === "dark" ? "#C9A227" : "#3182CE", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em" }}>
                {lang === "en" ? "AI-POWERED ADMISSIONS" : "TUYỂN SINH THÔNG MINH"}
              </span>
            </div>
            <h2 className="transition-colors duration-300" style={{ color: chatTheme === "dark" ? "#fff" : "#1A202C", fontSize: 32, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 360 }}>
              {lang === "en" ? "Your journey to VinUni starts here." : "Hành trình đến VinUni bắt đầu từ đây."}
            </h2>
            <p className="transition-colors duration-300" style={{ color: chatTheme === "dark" ? "rgba(255,255,255,0.6)" : "#334155", fontSize: 14, marginTop: 12, maxWidth: 320, lineHeight: 1.6 }}>
              {lang === "en"
                ? "Ask anything about programs, scholarships, or how to apply."
                : "Hỏi bất cứ điều gì về ngành học, học bổng hoặc cách đăng ký."}
            </p>
          </div>
        </div>

        {/* ── Right Panel — chat ── */}
        <div
          className="flex flex-col w-full lg:w-[420px] shrink-0 transition-colors duration-200 border-l"
          style={{
            background: chatTheme === "dark" ? "#0f172a" : "#ffffff",
            borderColor: chatTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(11,35,65,0.08)",
            boxShadow: chatTheme === "dark" ? "-8px 0 40px rgba(0,0,0,0.4)" : "-8px 0 40px rgba(11,35,65,0.18)"
          }}
        >
          <ChatHeader
            lang={lang}
            onLangChange={setLang}
            showClose={false}
            theme={chatTheme}
          />

          <ChatWidget lang={lang} sessionId={sessionId} theme={chatTheme} />
        </div>
      </div>
    </div>
  );
}
