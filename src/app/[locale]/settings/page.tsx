"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ArrowLeft, Check, Globe } from "lucide-react";

const localeLabels: Record<string, string> = {
  en: "English",
  "zh-cn": "简体中文",
  "zh-tw": "繁體中文",
};

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, {
      locale: newLocale as (typeof routing.locales)[number],
    });
  };

  return (
    <main className="homepage bg-grid min-h-screen relative">
      <div className="hp-grain" />

      <div
        className="hp-mesh"
        style={{
          width: 500,
          height: 500,
          top: -150,
          right: -100,
          background:
            "radial-gradient(circle, rgba(184,112,59,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-screen-sm mx-auto px-4 sm:px-6 pt-8 pb-16 relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
          style={{ color: "var(--hp-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--hp-accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--hp-text-muted)")
          }
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToDashboard")}
        </button>

        {/* Page title */}
        <h1
          className="text-2xl sm:text-3xl font-bold mb-8"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--hp-text)",
          }}
        >
          {t("title")}
        </h1>

        {/* Language section */}
        <section
          className="rounded-2xl p-5 sm:p-6"
          style={{
            background: "var(--hp-glass, #ffffff)",
            border: "1px solid var(--hp-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4.5 h-4.5" style={{ color: "var(--hp-accent)" }} />
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--hp-text)" }}
            >
              {t("language")}
            </h2>
          </div>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--hp-text-muted)" }}
          >
            {t("languageDescription")}
          </p>

          <div className="flex flex-col gap-2">
            {routing.locales.map((loc) => {
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: isActive
                      ? "var(--hp-accent-glow, rgba(199,139,60,0.10))"
                      : "transparent",
                    border: isActive
                      ? "1.5px solid var(--hp-accent)"
                      : "1.5px solid var(--hp-border)",
                    color: isActive ? "var(--hp-accent)" : "var(--hp-text)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--hp-accent)";
                      e.currentTarget.style.background =
                        "var(--hp-accent-glow, rgba(199,139,60,0.05))";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "var(--hp-border)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span>{localeLabels[loc] ?? loc}</span>
                  {isActive && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
