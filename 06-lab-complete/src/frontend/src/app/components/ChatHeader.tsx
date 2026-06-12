import { X, Sparkles, Maximize2, Sun, Moon } from "lucide-react";
import type { Lang } from "../lib/i18n";
import { i18n } from "../lib/i18n";

interface ChatHeaderProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  onClose?: () => void;
  onExpand?: () => void;
  showClose?: boolean;
  showExpand?: boolean;
  theme?: "light" | "dark";
}

export function ChatHeader({
  lang,
  onLangChange,
  onClose,
  onExpand,
  showClose = true,
  showExpand = false,
  theme = "light",
}: ChatHeaderProps) {
  const t = i18n[lang];

  const isDark = theme === "dark";
  const headerBg = isDark ? "#1e293b" : "#ffffff";
  const titleColor = isDark ? "#ffffff" : "#0f172a";
  const statusColor = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(15, 23, 42, 0.5)";
  const btnColor = isDark ? "rgba(255, 255, 255, 0.55)" : "#475569";
  const btnHoverClass = isDark ? "hover:bg-white/10" : "hover:bg-slate-100";
  const borderBottom = isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.06)";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 shrink-0 transition-colors duration-200"
      style={{
        background: headerBg,
        minHeight: 60,
        borderBottom: borderBottom,
      }}
    >
      {/* Logo */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: isDark ? "rgba(201,162,39,0.18)" : "rgba(49,130,206,0.1)",
          border: isDark ? "1px solid rgba(201,162,39,0.3)" : "1px solid rgba(49,130,206,0.22)",
        }}
      >
        <Sparkles size={16} style={{ color: isDark ? "#C9A227" : "#3182CE" }} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ color: titleColor, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}
        >
          {t.chatTitle}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#4ade80" }}
          />
          <span style={{ color: statusColor, fontSize: 11 }}>
            {t.chatStatus}
          </span>
        </div>
      </div>

      {/* Expand */}
      {showExpand && onExpand && (
        <button
          onClick={onExpand}
          title={t.expandChat}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${btnHoverClass} shrink-0`}
          style={{ background: "none", border: "none", cursor: "pointer", color: btnColor }}
        >
          <Maximize2 size={14} />
        </button>
      )}

      {/* Close */}
      {showClose && onClose && (
        <button
          onClick={onClose}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${btnHoverClass} shrink-0`}
          style={{ background: "none", border: "none", cursor: "pointer", color: btnColor }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
