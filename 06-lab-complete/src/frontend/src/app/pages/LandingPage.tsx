import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  GraduationCap,
  BookOpen,
  Award,
  Bot,
  X,
  Send,
  Sun,
  Moon,
} from "lucide-react";
import campusHero from "../../imports/image-1.png";
import { i18n, type Lang } from "../lib/i18n";
import { ChatHeader } from "../components/ChatHeader";
import { ChatWidget } from "../components/ChatWidget";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export function LandingPage() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [chatTheme, setChatTheme] = useState<"light" | "dark">(() => (localStorage.getItem("chat_theme") as "light" | "dark") || "light");
  
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
    <div className="size-full flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero ── */}
      <section className="relative w-full h-full min-h-screen flex flex-col">

        {/* Background */}
        <div className="absolute inset-0 z-0" style={{ background: chatTheme === "dark" ? "transparent" : "#ffffff" }}>
          <img
            src={campusHero}
            alt="VinUniversity campus"
            className="w-full h-full object-cover object-center transition-all duration-300"
            style={{
              filter: chatTheme === "light" ? "brightness(0.95)" : "none",
              opacity: chatTheme === "light" ? 0.45 : 1
            }}
          />
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: chatTheme === "dark"
                ? "linear-gradient(160deg, rgba(11,35,65,0.6) 0%, rgba(15,23,42,0.88) 100%)"
                : "linear-gradient(160deg, rgba(255,255,255,0.25) 0%, rgba(240,244,248,0.35) 100%)"
            }}
          />
        </div>

        {/* Nav */}
        <nav
          className="relative z-20 flex items-center justify-between px-8 py-2.5 md:px-16 transition-all duration-300"
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

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {t.nav.map((item) => (
              <button key={item} className="transition-colors duration-300" style={{ color: chatTheme === "dark" ? "rgba(255,255,255,0.75)" : "rgba(26, 32, 44, 0.75)", fontSize: 14, fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher lang={lang} onLangChange={setLang} dark={chatTheme === "light"} />
            
            {/* Global Theme Switcher */}
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

            <button
              className="hidden md:flex items-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: chatTheme === "dark" ? "#C9A227" : "#3182CE",
                color: chatTheme === "dark" ? "#0B2341" : "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                padding: "10px 20px",
                borderRadius: 12,
                boxShadow: chatTheme === "dark" ? "0 4px 14px rgba(201,162,39,0.35)" : "0 4px 14px rgba(49, 130, 206, 0.35)"
              }}
            >
              {t.applyNow}
              <ChevronRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-24 pt-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: chatTheme === "dark" ? "rgba(201,162,39,0.15)" : "rgba(49, 130, 206, 0.08)",
              border: chatTheme === "dark" ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(49, 130, 206, 0.25)",
              backdropFilter: "blur(12px)"
            }}
          >
            <Award size={13} style={{ color: chatTheme === "dark" ? "#C9A227" : "#3182CE" }} />
            <span style={{ color: chatTheme === "dark" ? "#C9A227" : "#3182CE", fontSize: 12, fontWeight: 600, letterSpacing: "0.07em" }}>{t.badge}</span>
          </div>

          <h1
            className="max-w-4xl mx-auto mb-6 transition-colors duration-300"
            style={{ color: chatTheme === "dark" ? "#fff" : "#1A202C", fontSize: "clamp(36px,5.5vw,72px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em" }}
          >
            {t.headline1}
            <br />
            <span style={{ color: chatTheme === "dark" ? "#C9A227" : "#3182CE" }}>{t.headline2}</span>
          </h1>

          <p className="max-w-xl mx-auto mb-12 transition-colors duration-300" style={{ color: chatTheme === "dark" ? "rgba(255,255,255,0.78)" : "#334155", fontSize: "clamp(15px,1.8vw,19px)", fontWeight: 400, lineHeight: 1.65 }}>
            {t.sub}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              className="flex items-center gap-2.5 transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: chatTheme === "dark" ? "#C9A227" : "#3182CE",
                color: chatTheme === "dark" ? "#0B2341" : "#ffffff",
                fontSize: 16,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                padding: "16px 32px",
                borderRadius: 12,
                boxShadow: chatTheme === "dark" ? "0 8px 28px rgba(201,162,39,0.45)" : "0 8px 28px rgba(49, 130, 206, 0.45)"
              }}
            >
              <GraduationCap size={18} strokeWidth={2.2} />
              {t.applyNow}
            </button>
            <button
              className="flex items-center gap-2.5 transition-all duration-200 active:scale-95"
              style={{
                background: chatTheme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(26,32,44,0.05)",
                color: chatTheme === "dark" ? "#fff" : "#1A202C",
                fontSize: 16,
                fontWeight: 600,
                border: chatTheme === "dark" ? "1.5px solid rgba(255,255,255,0.35)" : "1.5px solid rgba(26,32,44,0.2)",
                cursor: "pointer",
                padding: "16px 32px",
                borderRadius: 12,
                backdropFilter: "blur(12px)"
              }}
            >
              <BookOpen size={18} strokeWidth={2} />
              {t.explorePrograms}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 mt-20 items-center">
            {t.stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span style={{ color: chatTheme === "dark" ? "#C9A227" : "#3182CE", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</span>
                <span className="transition-colors duration-300" style={{ color: chatTheme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(26, 32, 44, 0.7)", fontSize: 12, letterSpacing: "0.04em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Floating Chatbot ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {chatOpen && (
          <div
            className="flex flex-col overflow-hidden transition-all duration-200"
            style={{
              width: 360,
              height: 500,
              borderRadius: 16,
              background: chatTheme === "dark" ? "#0f172a" : "#ffffff",
              boxShadow: chatTheme === "dark" 
                ? "0 24px 64px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)" 
                : "0 24px 64px rgba(11,35,65,0.12), 0 4px 16px rgba(11,35,65,0.06)",
              border: chatTheme === "dark" 
                ? "1px solid rgba(255, 255, 255, 0.12)" 
                : "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <ChatHeader
              lang={lang}
              onLangChange={setLang}
              onClose={() => setChatOpen(false)}
              onExpand={() => navigate("/chat", { state: { lang, theme: chatTheme } })}
              showExpand={true}
              theme={chatTheme}
              onThemeToggle={toggleChatTheme}
            />

            {/* Chat Body & Input */}
            <ChatWidget lang={lang} sessionId={sessionId} theme={chatTheme} />
          </div>
        )}

        {/* Trigger */}
        <div className="relative">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: chatTheme === "dark" ? "#C9A227" : "#3182CE",
              border: "none",
              cursor: "pointer",
              boxShadow: chatTheme === "dark"
                ? "0 8px 32px rgba(201,162,39,0.35), 0 2px 8px rgba(201,162,39,0.2)"
                : "0 8px 32px rgba(49, 130, 206, 0.35), 0 2px 8px rgba(49, 130, 206, 0.2)"
            }}
          >
            {chatOpen ? (
              <X size={22} color={chatTheme === "dark" ? "#0B2341" : "#ffffff"} strokeWidth={2} />
            ) : (
              <Bot size={22} color={chatTheme === "dark" ? "#0B2341" : "#ffffff"} strokeWidth={1.8} />
            )}
          </button>
          {!chatOpen && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ background: "#4ade80" }} />
          )}
        </div>
      </div>
    </div>
  );
}
