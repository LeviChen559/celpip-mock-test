"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/hooks/use-auth";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("signup");
  const tc = useTranslations("common");
  const { currentUser, loading, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/payment");
    }
  }, [loading, currentUser, router]);

  if (loading || currentUser) {
    return (
      <main className="homepage bg-grid min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--hp-accent)" }}
        />
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      if (!name.trim()) { setError(t("nameRequired")); setSubmitting(false); return; }
      if (!email.trim()) { setError(t("emailRequired")); setSubmitting(false); return; }
      if (password.length < 6) { setError(t("passwordMin")); setSubmitting(false); return; }
      const err = await signUp(name.trim(), email.trim().toLowerCase(), password);
      if (err) {
        const msg = err.toLowerCase().includes("rate") ? t("tooManyAttempts") : err;
        setError(msg); setSubmitting(false); return;
      }
      setSuccess(t("accountCreated"));
      setSubmitting(false);
    } catch {
      setError(t("somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="homepage bg-grid min-h-screen relative flex items-center justify-center px-4">
      {/* Grain */}
      <div className="hp-grain" />

      {/* Background meshes */}
      <div
        className="hp-mesh"
        style={{
          width: 500,
          height: 500,
          top: -100,
          right: -100,
          background:
            "radial-gradient(circle, rgba(184,112,59,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="hp-mesh"
        style={{
          width: 400,
          height: 400,
          bottom: -100,
          left: -100,
          background:
            "radial-gradient(circle, rgba(107,143,113,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Decorative rings */}
      <div
        className="hp-deco-ring"
        style={{ width: 300, height: 300, top: "10%", right: -120 }}
      />
      <div
        className="hp-deco-ring"
        style={{ width: 200, height: 200, bottom: "15%", left: -80 }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back to home + language switcher */}
        <div className="flex items-center justify-between mb-8 hp-reveal">
          <button
            onClick={() => router.push("/")}
            className="text-xs font-semibold tracking-widest block transition-colors"
            style={{ color: "var(--hp-accent)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--hp-accent-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--hp-accent)")
            }
          >
            &larr; PugPIP
          </button>
          <LanguageSwitcher />
        </div>

        {/* Card */}
        <div className="hp-glass rounded-3xl p-8 relative overflow-hidden hp-reveal hp-reveal-d1">
          {/* Accent top line */}
          <div
            className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
            style={{ background: "var(--hp-accent)", opacity: 0.4 }}
          />

          <div className="text-center mb-8">
            <div
              className="relative inline-block mb-5"
              style={{ animation: "hp-float 5s ease-in-out infinite" }}
            >
              <Image
                src="/puggy-happy.png"
                alt="StudyPug mascot"
                width={100}
                height={100}
                className="drop-shadow-md"
              />
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--hp-text)",
              }}
            >
              {t("createAccount")}
            </h1>
            <p className="text-sm" style={{ color: "var(--hp-text-muted)" }}>
              {t("subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="hp-reveal hp-reveal-d2">
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--hp-text)" }}
              >
                {tc("name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all outline-none"
                style={{
                  background: "var(--hp-bg)",
                  border: "1px solid var(--hp-border)",
                  color: "var(--hp-text)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--hp-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--hp-border)")
                }
              />
            </div>

            <div className="hp-reveal hp-reveal-d2">
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--hp-text)" }}
              >
                {tc("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all outline-none"
                style={{
                  background: "var(--hp-bg)",
                  border: "1px solid var(--hp-border)",
                  color: "var(--hp-text)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--hp-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--hp-border)")
                }
              />
            </div>

            <div className="hp-reveal hp-reveal-d3">
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--hp-text)" }}
              >
                {tc("password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all outline-none"
                style={{
                  background: "var(--hp-bg)",
                  border: "1px solid var(--hp-border)",
                  color: "var(--hp-text)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--hp-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--hp-border)")
                }
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="hp-cta-btn w-full rounded-full py-3.5 text-sm flex items-center justify-center gap-2 hp-reveal hp-reveal-d4"
            >
              {submitting ? (
                tc("pleaseWait")
              ) : (
                <>
                  {t("createAccount")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 hp-reveal hp-reveal-d5">
            <button
              onClick={() => router.push("/login")}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--hp-accent)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--hp-accent-light)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--hp-accent)")
              }
            >
              {t("hasAccount")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
