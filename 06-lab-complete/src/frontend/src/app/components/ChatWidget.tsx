import { useState, useEffect, useRef } from "react";
import { Send, Bot, User } from "lucide-react";
import { i18n, type Lang } from "../lib/i18n";

type MessageRole = "user" | "ai" | "typing";

interface Message {
  id: string;
  role: MessageRole;
  text?: string;
  chips?: string[];
}

const TYPING_DELAY = 1400;

interface ChatWidgetProps {
  lang: Lang;
  sessionId: string;
  theme?: "light" | "dark";
}

// Custom packing algorithm to organize suggestion chips into an Inverted Triangle Layout
function getInvertedTriangleRows(suggestions: string[]): string[][] {
  if (suggestions.length === 0) return [];

  // 1. Sort descending by length (longest strings at the top)
  const sorted = [...suggestions].sort((a, b) => b.length - a.length);

  // 2. Estimate visual pixel width for each chip
  const getWidth = (str: string) => str.length * 6.5 + 32;

  // 3. Define target widths for each row (shrinking towards the bottom)
  const longestWidth = getWidth(sorted[0]);
  const scaleFactors = [1.0, 0.72, 0.48, 0.28];
  const targetWidths = scaleFactors.map(f => longestWidth * f);

  const rows: string[][] = [];
  let remaining = [...sorted];

  for (let r = 0; r < targetWidths.length && remaining.length > 0; r++) {
    const row: string[] = [];
    let currentWidth = 0;
    const limit = targetWidths[r];

    // Always take at least one item per row
    const first = remaining.shift()!;
    row.push(first);
    currentWidth += getWidth(first);

    // Pack more items if they fit under the target width
    while (remaining.length > 0) {
      const next = remaining[0];
      const nextWidth = getWidth(next);
      if (currentWidth + nextWidth + 8 <= limit) {
        row.push(remaining.shift()!);
        currentWidth += nextWidth + 8;
      } else {
        break;
      }
    }
    rows.push(row);
  }

  // Append any leftovers to the last row
  if (remaining.length > 0) {
    if (rows.length > 0) {
      rows[rows.length - 1] = rows[rows.length - 1].concat(remaining);
    } else {
      rows.push(remaining);
    }
  }

  return rows;
}

export function ChatWidget({ lang, sessionId, theme = "light" }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat_messages_${sessionId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const faqDone = true;

  // Keep a ref to always access the latest lang inside callbacks/timeouts
  const langRef = useRef<Lang>(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    const persistMessages = messages.filter(m => m.role !== "typing");
    localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(persistMessages));
  }, [messages, sessionId]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = i18n[lang];

  /* Boot: show greeting only */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "ai",
          text: "__greeting__",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-translate faq chips whenever lang changes OR on first mount (for messages restored from localStorage) */
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === "faq-ai" && m.role === "ai") {
          return { ...m, chips: i18n[lang].faq.chips };
        }
        return m;
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const id = `msg-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role: "user", text }]);
    setInputValue("");

    // Show typing indicator
    setMessages((prev) => [...prev, { id: `typing-${id}`, role: "typing" }]);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": "secret-key-123"
        },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== `typing-${id}`)
          .concat({ id: `ai-${id}`, role: "ai", text: data.response })
      );
    } catch (error) {
      console.error("Chat error:", error);
      
      // Send error to backend logger
      try {
        await fetch("/api/v1/log", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-API-Key": "secret-key-123"
          },
          body: JSON.stringify({
            level: "error",
            component: "frontend.chat",
            message: "Failed to send chat message",
            details: { error: String(error) }
          })
        });
      } catch (logErr) {
        console.error("Failed to send log to backend", logErr);
      }

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== `typing-${id}`)
          .concat({ id: `ai-${id}`, role: "ai", text: langRef.current === "en" ? "Sorry, something went wrong. Please try again." : "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." })
      );
    }
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    await sendMessage(text);
  }

  function resolveText(m: Message) {
    if (m.text === "__greeting__") return null; // rendered separately
    if (m.text === "__faq-user__") return t.faq.userQuestion;
    if (m.text === "__faq-ai__") return t.faq.aiResponse;
    return m.text ?? "";
  }

  const isDark = theme === "dark";

  // Chip styles based on theme to satisfy WCAG contrast standard
  const chipClass = isDark
    ? "transition-all duration-200 hover:scale-105 active:scale-95 border border-[rgba(201,162,39,0.35)] hover:border-[rgba(201,162,39,0.55)] bg-[rgba(201,162,39,0.12)] hover:bg-[rgba(201,162,39,0.18)] text-[#ffcb3c] shadow-md"
    : "transition-all duration-200 hover:scale-105 active:scale-95 border border-[rgba(49,130,206,0.22)] hover:border-[rgba(49,130,206,0.45)] bg-[rgba(49,130,206,0.04)] hover:bg-[rgba(49,130,206,0.08)] text-[#3182CE] shadow-[0_2px_6px_rgba(49,130,206,0.04)]";

  // Group initial quick replies
  const quickReplyRows = getInvertedTriangleRows(t.quickReplies);

  return (
    <div className="flex flex-col h-full w-full rounded-b-2xl overflow-hidden transition-colors duration-200" style={{ background: isDark ? "#0f172a" : "#ffffff" }}>
      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5 transition-colors duration-200" 
        style={{ background: isDark ? "#0f172a" : "#f8fafc" }}
      >
        {/* Greeting */}
        {messages.some((m) => m.id === "greeting") && (
          <div className="flex items-start gap-2 w-full" style={{ minWidth: 0 }}>
            <BotAvatar isDark={isDark} />
            <div
              style={{ 
                background: isDark ? "#1e293b" : "#ffffff", 
                borderRadius: "16px 16px 16px 4px", 
                padding: "14px 16px", 
                boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.15)" : "0 4px 20px rgba(11,35,65,0.03)", 
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(11,35,65,0.04)", 
                maxWidth: "68%",
                wordBreak: "break-word",
                overflowWrap: "break-word"
              }}
              className="flex flex-col gap-2.5 transition-colors duration-200"
            >
              <p style={{ color: isDark ? "#ffffff" : "#0B2341", fontSize: 14, fontWeight: 700 }}>{t.greeting.hello}</p>
              <p style={{ color: isDark ? "#94a3b8" : "#475569", fontSize: 13, lineHeight: 1.6 }}>{t.greeting.intro}</p>
              <div>
                <p style={{ color: isDark ? "#ffffff" : "#0B2341", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.greeting.canHelp}</p>
                <ul className="flex flex-col gap-1.5">
                  {t.greeting.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: isDark ? "#C9A227" : "#3182CE" }} />
                      <span style={{ color: isDark ? "#94a3b8" : "#475569", fontSize: 13 }}>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ color: isDark ? "#64748b" : "#64748b", fontSize: 12, lineHeight: 1.5, paddingTop: 6, borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(11,35,65,0.06)" }}>
                {t.greeting.cta}
              </p>
            </div>
          </div>
        )}

        {/* Quick reply chips */}
        {messages.length === 1 && (
          <div className="flex flex-wrap justify-start gap-1.5 w-full pl-8 pr-2" style={{ flexWrap: "wrap" }}>
            {t.quickReplies.map((label) => (
              <button
                key={label}
                onClick={() => sendMessage(label)}
                className={chipClass}
                style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 20, cursor: "pointer" }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic messages */}
        {messages.filter((m) => m.id !== "greeting").map((m) => {
          if (m.role === "typing") {
            return (
              <div key={m.id} className="flex items-end gap-2">
                <BotAvatar isDark={isDark} />
                <TypingBubble label={t.faq.typingLabel} isDark={isDark} />
              </div>
            );
          }

          if (m.role === "user") {
            return (
              <div key={m.id} className="flex items-end gap-2 justify-end w-full" style={{ minWidth: 0 }}>
                {/* User bubble: White with border and light shadow in light mode, Dark Slate in dark mode */}
                <div
                  style={{
                    background: isDark ? "#1e293b" : "#ffffff",
                    borderRadius: "16px 16px 4px 16px",
                    padding: "10px 16px",
                    maxWidth: "68%",
                    boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.03)",
                    border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}
                  className="transition-colors duration-200"
                >
                  <p style={{ color: isDark ? "#f8fafc" : "#0f172a", fontSize: 13, lineHeight: 1.6, wordBreak: "break-word", overflowWrap: "break-word" }}>{resolveText(m)}</p>
                </div>
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm border transition-colors duration-200" 
                  style={{ 
                    background: isDark ? "#334155" : "#f1f5f9",
                    borderColor: isDark ? "#475569" : "#e2e8f0" 
                  }}
                >
                  <User size={11} color={isDark ? "#f8fafc" : "#0B2341"} />
                </div>
              </div>
            );
          }

          /* ai */
          // Group suggestion chips for AI response
          const aiChipsRows = m.chips ? getInvertedTriangleRows(m.chips) : [];

          return (
            <div key={m.id} className="flex flex-col gap-2 w-full" style={{ minWidth: 0 }}>
              <div className="flex items-end gap-2 w-full" style={{ minWidth: 0 }}>
                <BotAvatar isDark={isDark} />
                {/* AI Bubble: Light gray background */}
                <div
                  style={{
                    background: isDark ? "#334155" : "#f3f4f6",
                    borderRadius: "16px 16px 16px 4px",
                    padding: "12px 16px",
                    maxWidth: "68%",
                    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                    border: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.01)",
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}
                  className="transition-colors duration-200"
                >
                  <p style={{ color: isDark ? "#f1f5f9" : "#334155", fontSize: 13, lineHeight: 1.65, wordBreak: "break-word", overflowWrap: "break-word" }}>{resolveText(m)}</p>
                </div>
              </div>

              {/* Suggestion chips */}
              {m.chips && (
                <div className="flex flex-wrap justify-start gap-1.5 w-full pl-8 pr-2 mt-1" style={{ flexWrap: "wrap" }}>
                  {m.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className={chipClass}
                      style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 20, cursor: "pointer" }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — Nested Floating bar */}
      <div className="shrink-0 px-4 pb-4 pt-2 transition-colors duration-200" style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl transition-all duration-200"
          style={{
            background: isDark ? "#1e293b" : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(11,35,65,0.08)",
            boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(11,35,65,0.03)"
          }}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.placeholder}
            disabled={!faqDone}
            className={`flex-1 outline-none bg-transparent ${isDark ? "placeholder:text-slate-500 text-slate-100" : "placeholder:text-slate-400 text-[#0B2341]"}`}
            style={{ fontSize: 13, caretColor: isDark ? "#C9A227" : "#3182CE", opacity: faqDone ? 1 : 0.4 }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !faqDone}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 hover:brightness-110 active:scale-95"
            style={{
              background: isDark
                ? (inputValue.trim() && faqDone ? "#C9A227" : "rgba(201, 162, 39, 0.12)")
                : (inputValue.trim() && faqDone ? "#3182CE" : "rgba(49, 130, 206, 0.12)"),
              border: isDark
                ? `1px solid ${inputValue.trim() && faqDone ? "#C9A227" : "rgba(201, 162, 39, 0.35)"}`
                : `1px solid ${inputValue.trim() && faqDone ? "#3182CE" : "rgba(49, 130, 206, 0.35)"}`,
              cursor: inputValue.trim() && faqDone ? "pointer" : "default",
              flexShrink: 0
            }}
          >
            <Send 
              size={13} 
              color={isDark
                ? (inputValue.trim() && faqDone ? "#0B2341" : "#C9A227")
                : (inputValue.trim() && faqDone ? "#ffffff" : "#3182CE")} 
              strokeWidth={2} 
              style={{ opacity: inputValue.trim() && faqDone ? 1 : 0.6 }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function BotAvatar({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm border transition-all duration-200"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0B2341 0%, #1c3d6b 100%)"
          : "linear-gradient(135deg, #3182CE 0%, #2b6cb0 100%)",
        borderColor: isDark ? "rgba(201,162,39,0.3)" : "rgba(49,130,206,0.3)",
      }}
    >
      <Bot size={11} color={isDark ? "#C9A227" : "#ffffff"} />
    </div>
  );
}

function TypingBubble({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 transition-colors duration-200"
      style={{ 
        background: isDark ? "#334155" : "#fff", 
        borderRadius: "16px 16px 16px 4px", 
        boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 10px rgba(11,35,65,0.07)", 
        border: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(11,35,65,0.06)" 
      }}
    >
      <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isDark ? "#C9A227" : "#3182CE",
              animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
