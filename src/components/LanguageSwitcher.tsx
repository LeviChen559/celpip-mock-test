"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "en" | "zh-cn" | "zh-tw" });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        style={{ color: "var(--hp-text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--hp-text)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--hp-text-muted)")
        }
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t(locale as "en" | "zh-cn" | "zh-tw")}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-xl py-1 shadow-lg z-50 min-w-[140px] overflow-hidden"
          style={{
            background: "var(--hp-glass, #ffffff)",
            border: "1px solid var(--hp-border)",
            backdropFilter: "blur(12px)",
          }}
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSwitch(loc)}
              className="w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2"
              style={{
                color:
                  loc === locale ? "var(--hp-accent)" : "var(--hp-text)",
                fontWeight: loc === locale ? 600 : 400,
                background: loc === locale ? "var(--hp-accent-glow, rgba(199,139,60,0.08))" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (loc !== locale)
                  e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }}
              onMouseLeave={(e) => {
                if (loc !== locale)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {t(loc as "en" | "zh-cn" | "zh-tw")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
