import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import type { Lang } from "../lib/i18n";

interface LanguageSwitcherProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  dark?: boolean; // If true, styling is for light background (so text/icons are dark)
}

export function LanguageSwitcher({ lang, onLangChange, dark = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const textColor = dark ? "#0B2341" : "#ffffff";
  const hoverBg = dark ? "rgba(11, 35, 65, 0.08)" : "rgba(255, 255, 255, 0.12)";
  const activeBg = dark ? "rgba(49, 130, 206, 0.15)" : "rgba(201, 162, 39, 0.22)";
  const dropdownBg = dark ? "rgba(255, 255, 255, 0.92)" : "rgba(11, 35, 65, 0.92)";
  const dropdownBorder = dark ? "rgba(11, 35, 65, 0.08)" : "rgba(255, 255, 255, 0.1)";

  const handleSelect = (selectedLang: Lang) => {
    onLangChange(selectedLang);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left shrink-0">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 hover:bg-white/10"
        style={{
          background: isOpen ? hoverBg : "transparent",
          border: `1.5px solid ${dark ? "rgba(11,35,65,0.15)" : "rgba(255,255,255,0.15)"}`,
          cursor: "pointer",
          color: textColor,
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.02em",
        }}
      >
        <Globe size={15} style={{ opacity: 0.85 }} />
        <span>{lang === "en" ? "EN" : "VI"}</span>
        <ChevronDown
          size={13}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            opacity: 0.7,
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            top: "100%",
            background: dropdownBg,
            border: `1px solid ${dropdownBorder}`,
            backdropFilter: "blur(16px)",
            padding: 6,
            minWidth: 145,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* EN Option */}
          <button
            onClick={() => handleSelect("en")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left"
            style={{
              background: lang === "en" ? activeBg : "transparent",
              border: "none",
              cursor: "pointer",
              color: lang === "en" ? (dark ? "#3182CE" : "#C9A227") : textColor,
              fontSize: 13,
              fontWeight: lang === "en" ? 700 : 500,
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 15 }}>🇺🇸</span>
              <span>English</span>
            </div>
            {lang === "en" && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: dark ? "#3182CE" : "#C9A227" }} />
            )}
          </button>

          {/* VI Option */}
          <button
            onClick={() => handleSelect("vi")}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left"
            style={{
              background: lang === "vi" ? activeBg : "transparent",
              border: "none",
              cursor: "pointer",
              color: lang === "vi" ? (dark ? "#3182CE" : "#C9A227") : textColor,
              fontSize: 13,
              fontWeight: lang === "vi" ? 700 : 500,
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 15 }}>🇻🇳</span>
              <span>Tiếng Việt</span>
            </div>
            {lang === "vi" && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: dark ? "#3182CE" : "#C9A227" }} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
