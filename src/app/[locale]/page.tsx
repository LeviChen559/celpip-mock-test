"use client";

import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTranslations } from "next-intl";
import HeroAnimation from "@/components/HeroAnimation";
import {
  Target,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Star,
  Sparkles,
  Check,
  X,
  CircleAlert,
  Clock,
  ShieldQuestion,
  Zap,
  Shield,
  Crown,
  BicepsFlexed,
} from "lucide-react";
import Image from "next/image";
import Logo from "../../../public/logo-celpip-en-hz@2x.png"
import LanguageSwitcher from "@/components/LanguageSwitcher";

const testimonials = [
  {
    name: "Priya S.",
    score: "CLB 7 → 9",
    location: "Toronto, ON",
    quote:
      "The AI found that my writing lacked coherence — I kept jumping between ideas. After two weeks of targeted drills, my writing score jumped from 7 to 9.",
    color: "#c78b3c",
  },
  {
    name: "Marco L.",
    score: "CLB 8 → 10",
    location: "Vancouver, BC",
    quote:
      "My daily tasks were exactly what I needed. The system knew my vocabulary was strong but my grammar was holding me back, so every drill focused there.",
    color: "#6b8f71",
  },
  {
    name: "Aisha K.",
    score: "CLB 6 → 8",
    location: "Calgary, AB",
    quote:
      "I only had 2 weeks. The AI diagnosed my weakest areas on day one, and the adaptive plan got me from 6 to 8. No wasted time on things I already knew.",
    color: "#7a8fc7",
  },
  {
    name: "David C.",
    score: "CLB 7 → 9",
    location: "Montreal, QC",
    quote:
      "Seeing my predicted score go up each week kept me motivated. The AI feedback on my speaking responses was more useful than any tutor I'd tried.",
    color: "#c77a8b",
  },
  {
    name: "Yuki T.",
    score: "CLB 8 → 10",
    location: "Ottawa, ON",
    quote:
      "The score progression chart showed exactly where I was improving and where I still had gaps. I walked into the real test knowing I was ready.",
    color: "#8bc7a3",
  },
  {
    name: "Fatima R.",
    score: "CLB 6 → 8",
    location: "Edmonton, AB",
    quote:
      "The AI kept adjusting my plan as I improved. Week one was all grammar drills, but by week three it shifted to full mock tests. Smart system.",
    color: "#c7a33c",
  },
];

export default function Home() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const t = useTranslations("landing");
  const tp = useTranslations("pricing");
  const tc = useTranslations("common");

  const handleCta = () =>
    router.push(!loading && currentUser ? "/dashboard" : "/signup");

  const trustIndicators = [t("trust1"), t("trust2"), t("trust3")];

  const stats = [
    { value: "2,000+", label: t("statsScoresImproved") },
    { value: "+1.5", label: t("statsAvgIncrease") },
    { value: "30", label: t("statsDayPlans") },
    { value: "4", label: t("statsScoreDimensions") },
  ];

  const problems = [
    {
      icon: ShieldQuestion,
      title: t("problem1Title"),
      description: t("problem1Desc"),
      color: "#c4493c",
    },
    {
      icon: CircleAlert,
      title: t("problem2Title"),
      description: t("problem2Desc"),
      color: "#c78b3c",
    },
    {
      icon: Clock,
      title: t("problem3Title"),
      description: t("problem3Desc"),
      color: "#7a8fc7",
    },
  ];

  const solutions = [
    {
      icon: Target,
      title: t("solution1Title"),
      description: t("solution1Desc"),
      callout: t("solution1Callout"),
      color: "#c78b3c",
    },
    {
      icon: CalendarCheck,
      title: t("solution2Title"),
      description: t("solution2Desc"),
      callout: t("solution2Callout"),
      color: "#6b8f71",
    },
    {
      icon: TrendingUp,
      title: t("solution3Title"),
      description: t("solution3Desc"),
      callout: t("solution3Callout"),
      color: "#7a8fc7",
    },
  ];

  const steps = [
    {
      step: "1",
      title: t("step1Title"),
      description: t("step1Desc"),
      color: "#c78b3c",
      cta: t("step1Cta"),
      href: "/quiz/listening?part=0",
    },
    {
      step: "2",
      title: t("step2Title"),
      description: t("step2Desc"),
      color: "#6b8f71",
      cta: t("step2Cta"),
      href: "/quiz-practice/writing?part=0",
    },
    {
      step: "3",
      title: t("step3Title"),
      description: t("step3Desc"),
      color: "#7a8fc7",
      cta: t("step3Cta"),
      href: "/signup",
    },
  ];

  const dashboardFeatures = [
    t("dashboardFeature1"),
    t("dashboardFeature2"),
    t("dashboardFeature3"),
    t("dashboardFeature4"),
  ];

  const comparisonRows = [
    { feature: t("compareFeedback"), old: t("compareFeedbackOld"), pugpip: t("compareFeedbackNew") },
    { feature: t("compareStudyPlan"), old: t("compareStudyPlanOld"), pugpip: t("compareStudyPlanNew") },
    { feature: t("compareWeakness"), old: t("compareWeaknessOld"), pugpip: t("compareWeaknessNew") },
    { feature: t("compareScoreTracking"), old: t("compareScoreTrackingOld"), pugpip: t("compareScoreTrackingNew") },
    { feature: t("comparePracticeModes"), old: t("comparePracticeModesOld"), pugpip: t("comparePracticeModesNew") },
    { feature: t("compareTime"), old: t("compareTimeOld"), pugpip: t("compareTimeNew") },
  ];

  const plans = [
    {
      id: "free",
      name: tp("freeName"),
      price: tp("freePrice"),
      period: tp("freePeriod"),
      description: tp("freeDesc"),
      icon: Zap,
      accent: false,
      popular: false,
      features: [
        tp("freeFeature1"),
        tp("freeFeature2"),
        tp("freeFeature3"),
        tp("freeFeature4"),
        tp("freeFeature5"),
      ],
      cta: tp("freeCta"),
    },
    {
      id: "improver",
      name: tp("improverName"),
      price: tp("improverPrice"),
      period: tp("improverPeriod"),
      description: tp("improverDesc"),
      icon: Sparkles,
      accent: true,
      popular: true,
      features: [
        tp("improverFeature1"),
        tp("improverFeature2"),
        tp("improverFeature3"),
        tp("improverFeature4"),
        tp("improverFeature5"),
        tp("improverFeature6"),
      ],
      cta: tp("improverCta"),
    },
    {
      id: "intensive",
      name: tp("intensiveName"),
      price: tp("intensivePrice"),
      period: tp("intensivePeriod"),
      description: tp("intensiveDesc"),
      icon: BicepsFlexed,
      accent: false,
      popular: false,
      features: [
        tp("intensiveFeature1"),
        tp("intensiveFeature2"),
        tp("intensiveFeature3"),
        tp("intensiveFeature4"),
        tp("intensiveFeature5"),
        tp("intensiveFeature6"),
        tp("intensiveFeature7"),
      ],
      cta: tp("intensiveCta"),
    },
    {
      id: "guarantee",
      name: tp("guaranteeName"),
      price: tp("guaranteePrice"),
      period: tp("guaranteePeriod"),
      description: tp("guaranteeDesc"),
      icon: Crown,
      accent: false,
      popular: false,
      features: [
        tp("guaranteeFeature1"),
        tp("guaranteeFeature2"),
        tp("guaranteeFeature3"),
        tp("guaranteeFeature4"),
        tp("guaranteeFeature5"),
        tp("guaranteeFeature6"),
      ],
      cta: tp("guaranteeCta"),
    },
  ];

  const trustBadges = [t("cancelAnytime"), t("securePayment"), t("moneyBack")];

  return (
    <main className="homepage bg-grid min-h-screen relative">
      {/* Grain overlay */}
      <div className="hp-grain" />

      {/* Background meshes */}
      <div
        className="hp-mesh"
        style={{
          width: 600,
          height: 600,
          top: -200,
          right: -100,
          background:
            "radial-gradient(circle, rgba(184,112,59,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="hp-mesh"
        style={{
          width: 500,
          height: 500,
          bottom: "30%",
          left: -150,
          background:
            "radial-gradient(circle, rgba(107,143,113,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Decorative rings */}
      <div
        className="hp-deco-ring"
        style={{ width: 400, height: 400, top: 100, right: -180 }}
      />
      <div
        className="hp-deco-ring"
        style={{ width: 260, height: 260, top: "60%", left: -100 }}
      />

      {/* ── Nav ─────────────────────────────────────── */}
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex justify-between items-center relative z-20 hp-reveal">
        <span
          className="text-xs sm:text-sm font-semibold tracking-wider sm:tracking-widest shrink-0"
          style={{ color: "var(--hp-accent)" }}
        >
          <Image src={Logo} alt="logo"  width={100}  style={{aspectRatio:"256/113"}}/>
        </span>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSwitcher />
          {!loading && currentUser ? (
            <>
              <span
                className="text-sm hidden sm:inline"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {currentUser.name}
              </span>
              <button
                onClick={() => router.push("/dashboard")}
                className="hp-cta-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm"
              >
                {tc("dashboard")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-colors"
                style={{ color: "var(--hp-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--hp-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--hp-text-muted)")
                }
              >
                {tc("signIn")}
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="hp-cta-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm whitespace-nowrap"
              >
                {tc("getStarted")}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="hp-reveal hp-reveal-d1">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-6 px-4 py-2 rounded-full"
                style={{
                  color: "var(--hp-accent)",
                  background: "var(--hp-accent-glow)",
                  border: "1px solid rgba(199,139,60,0.2)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t("heroTag")}
              </span>
            </div>
            {/* Headline variation 2: "Hit your target CELPIP score in 30 days — not 6 months." */}
            {/* Headline variation 3: "Stuck at CLB 7? Your AI coach knows exactly what to fix." */}
            <h1
              className="hp-reveal hp-reveal-d2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {t("heroTitle1")}
              <br />
              <span
                className="hp-accent-line"
                style={{ color: "var(--hp-accent)" }}
              >
                {t("heroTitleAccent")}
              </span>{" "}
              {t("heroTitle2")}
            </h1>
            <p
              className="hp-reveal hp-reveal-d3 text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--hp-text-muted)" }}
            >
              {t("heroDescription")}
            </p>
            <div className="hp-reveal hp-reveal-d4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <button
                onClick={handleCta}
                className="hp-cta-btn px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {!loading && currentUser ? t("ctaDashboard") : t("ctaStart")}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all text-center"
                style={{
                  color: "var(--hp-text-muted)",
                  border: "1px solid var(--hp-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--hp-accent)";
                  e.currentTarget.style.color = "var(--hp-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--hp-border)";
                  e.currentTarget.style.color = "var(--hp-text-muted)";
                }}
              >
                {t("ctaHowItWorks")}
              </button>
            </div>
            {/* Trust indicators */}
            <div className="hp-reveal hp-reveal-d5 flex flex-wrap gap-4 sm:gap-6 mt-8 justify-center md:justify-start">
              {trustIndicators.map((indicator) => (
                <span
                  key={indicator}
                  className="text-xs font-medium flex items-center gap-1.5"
                  style={{ color: "var(--hp-text-muted)" }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--hp-accent)" }} />
                  {indicator}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 hp-reveal hp-reveal-d5">
            <HeroAnimation />
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────── */}
      <section className="relative z-10 my-8">
        <div className="hp-strip max-w-screen-xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 hp-reveal hp-reveal-d6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-2xl font-bold"
                style={{
                  color: "var(--hp-accent)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {s.value}
              </p>
              <p
                className="text-xs font-medium tracking-wide uppercase"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t.rich("problemTitle", {
              accent: (chunks) => <span style={{ color: "var(--hp-accent)" }}>{chunks}</span>,
            })}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {problems.map((p, i) => (
            <div
              key={p.title}
              className={`hp-problem-card rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${p.color}15`, color: p.color }}
              >
                <p.icon className="w-5 h-5" />
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--hp-text)" }}
              >
                {p.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 hp-reveal hp-reveal-d4">
          <p className="hp-quote-line">
            {t.rich("problemQuote", {
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>
        </div>
      </section>

      {/* ── Solution ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="hp-reveal">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-5 px-3 py-1.5 rounded-full"
              style={{
                color: "var(--hp-accent)",
                background: "var(--hp-accent-glow)",
                border: "1px solid rgba(199,139,60,0.15)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              {t("solutionTag")}
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal hp-reveal-d1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("solutionTitle1")}
            <br />
            <span style={{ color: "var(--hp-accent)" }}>{t("solutionTitleAccent")}</span>
          </h2>
          <p
            className="text-base max-w-2xl mx-auto hp-reveal hp-reveal-d2"
            style={{ color: "var(--hp-text-muted)" }}
          >
            {t("solutionDescription")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {solutions.map((s, i) => (
            <div
              key={s.title}
              className={`hp-glass rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: s.color, opacity: 0.5 }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="hp-icon-glow w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${s.color}15`, color: s.color }}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold mb-1.5"
                    style={{ color: "var(--hp-text)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "var(--hp-text-muted)" }}
                  >
                    {s.description}
                  </p>
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: `${s.color}12`, color: s.color }}
                  >
                    {s.callout}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section id="how-it-works" className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("howItWorksTitle1")}
            <span style={{ color: "var(--hp-accent)" }}>{t("howItWorksTitleAccent")}</span>
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`hp-glass rounded-2xl p-6 text-center relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              <div
                className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                style={{ background: s.color, opacity: 0.5 }}
              />
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold"
                style={{ background: `${s.color}15`, color: s.color, fontFamily: "var(--font-serif)" }}
              >
                {s.step}
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--hp-text)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {s.description}
              </p>
              <button
                onClick={() => router.push(s.href)}
                className="text-sm font-medium inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ color: s.color }}
              >
                {s.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Product Experience / Dashboard Demo ────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="hp-glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden hp-reveal">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(199,139,60,0.1) 0%, transparent 70%)",
            }}
          />
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Dashboard mockup — all 3 views stacked */}
            <div className="space-y-3 hp-reveal hp-reveal-d1">
              {/* Card 1: AI Feedback */}
              <div className="hp-mockup-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--hp-text-muted)" }}>
                    {t("mockupWritingTask")}
                  </p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--hp-accent-glow)", color: "var(--hp-accent)" }}>
                    {t("mockupOverall")}
                  </span>
                </div>
                {/* 4 dimension scores */}
                <div className="space-y-2.5">
                  {[
                    { dim: t("mockupTaskResponse"), score: 9, pct: "75%" },
                    { dim: t("mockupCoherence"), score: 7, pct: "58%" },
                    { dim: t("mockupVocabulary"), score: 8, pct: "67%" },
                    { dim: t("mockupGrammar"), score: 6, pct: "50%" },
                  ].map((d) => (
                    <div key={d.dim} className="flex items-center gap-3">
                      <span className="text-xs w-24 shrink-0" style={{ color: "var(--hp-text-muted)" }}>{d.dim}</span>
                      <div className="hp-dimension-bar">
                        <div className="hp-dimension-fill" style={{ width: d.pct }} />
                      </div>
                      <span className="text-xs font-bold w-6 text-right" style={{ color: "var(--hp-accent)" }}>{d.score}</span>
                    </div>
                  ))}
                </div>
                {/* Weakness tags */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="hp-weakness-tag">{t("mockupRunOnSentences")}</span>
                  <span className="hp-weakness-tag">{t("mockupLimitedTransition")}</span>
                  <span className="hp-weakness-tag">{t("mockupParagraphStructure")}</span>
                </div>
                {/* Improvement tip */}
                <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(107,143,113,0.06)", border: "1px solid rgba(107,143,113,0.12)" }}>
                  <p className="text-xs" style={{ color: "var(--hp-text)" }}>
                    <span className="font-semibold" style={{ color: "#6b8f71" }}>{t("mockupFix")}</span>{" "}
                    {t("mockupFixDesc")}
                  </p>
                </div>
              </div>

              {/* Card 2: All Sections Progress */}
              <div className="hp-mockup-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--hp-text-muted)" }}>
                    {t("mockupProgress")}
                  </p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(107,143,113,0.1)", color: "#6b8f71" }}>
                    {t("mockupAvgImprovement")}
                  </span>
                </div>
                {/* Section rows */}
                <div className="space-y-3">
                  {[
                    { name: tc("listening"), score: 9, prev: 8, color: "#e89234", barPct: "75%", sparkline: [6, 7, 7, 8, 8, 9], weakness: "Part 3: Viewpoints" },
                    { name: tc("reading"), score: 8, prev: 7, color: "#5a8a6a", barPct: "67%", sparkline: [5, 6, 6, 7, 7, 8], weakness: "Part 4: Opinions" },
                    { name: tc("writing"), score: 8, prev: 6, color: "#7a7ac7", barPct: "67%", sparkline: [5, 5, 6, 7, 7, 8], weakness: "Coherence" },
                    { name: tc("speaking"), score: 7, prev: 6, color: "#c77a8b", barPct: "58%", sparkline: [5, 5, 6, 6, 6, 7], weakness: "Grammar" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-xs w-16 shrink-0" style={{ color: "var(--hp-text)" }}>{s.name}</span>
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-px shrink-0" style={{ height: 16, width: 36 }}>
                        {s.sparkline.map((v, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                              height: `${Math.max((v / 12) * 100, 10)}%`,
                              background: s.color,
                              opacity: i === s.sparkline.length - 1 ? 1 : 0.4,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: s.barPct, background: s.color }} />
                      </div>
                      <span className="text-xs font-bold w-4 text-right" style={{ color: s.color }}>{s.score}</span>
                      <span className={`text-[10px] font-bold w-5 ${s.score > s.prev ? "text-green-600" : "text-yellow-600"}`}>
                        {s.score > s.prev ? `+${s.score - s.prev}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Weakness summary */}
                <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <p className="text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ color: "var(--hp-text-muted)" }}>
                    {t("mockupAreasToFocus")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Listening Part 3", color: "#e89234" },
                      { label: "Reading Part 4", color: "#5a8a6a" },
                      { label: "Writing: Coherence", color: "#7a7ac7" },
                      { label: "Speaking: Grammar", color: "#c77a8b" },
                    ].map((w) => (
                      <span
                        key={w.label}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${w.color}10`, color: w.color, border: `1px solid ${w.color}20` }}
                      >
                        {w.label}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "var(--hp-text-muted)" }}>{t("mockupPredictedNext")}</p>
                    <p className="text-lg font-bold" style={{ color: "var(--hp-accent)", fontFamily: "var(--font-serif)" }}>9.0</p>
                  </div>
                  <div className="rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "var(--hp-text-muted)" }}>{t("mockupStatus")}</p>
                    <p className="text-sm font-bold" style={{ color: "#6b8f71" }}>{t("mockupOnTrack")}</p>
                    <p className="text-[10px]" style={{ color: "var(--hp-text-muted)" }}>{t("mockupDaysRemaining", { days: 9 })}</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Daily Plan */}
              <div className="hp-mockup-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--hp-text-muted)" }}>
                    {t("mockupTodaysTasks")}
                  </p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#7a8fc715", color: "#7a8fc7" }}>
                    {t("mockupPhase2")}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { task: "Grammar Drill — Sentence Structure", time: "3 min", ai: true, reason: "Targets your #1 weakness" },
                    { task: "Writing Task 1 — AI Scored", time: "15 min", ai: true, reason: "Coherence focus" },
                    { task: "Vocabulary Review — Transition Words", time: "5 min", ai: false, reason: "" },
                  ].map((item) => (
                    <div
                      key={item.task}
                      className="rounded-lg px-3 py-2.5"
                      style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium" style={{ color: "var(--hp-text)" }}>{item.task}</span>
                        <span className="text-xs shrink-0 ml-2" style={{ color: "var(--hp-text-muted)" }}>{item.time}</span>
                      </div>
                      {item.ai && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="hp-ai-badge">
                            <Sparkles className="w-2.5 h-2.5" />
                            {t("mockupAiRecommended")}
                          </span>
                          <span className="text-[10px]" style={{ color: "var(--hp-text-muted)" }}>{item.reason}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs" style={{ color: "var(--hp-text-muted)" }}>{t("mockupDayOf30", { day: 21 })}</span>
                  <div className="hp-mockup-progress-bar w-24">
                    <div className="hp-mockup-progress-fill" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="hp-reveal hp-reveal-d2">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-5 px-3 py-1.5 rounded-full"
                style={{
                  color: "var(--hp-accent)",
                  background: "var(--hp-accent-glow)",
                  border: "1px solid rgba(199,139,60,0.15)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                {t("dashboardTag")}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {t("dashboardTitle1")}
                <br />
                <span style={{ color: "var(--hp-accent)" }}>{t("dashboardTitleAccent")}</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {t("dashboardDesc")}
              </p>
              <div className="space-y-3 mb-8">
                {dashboardFeatures.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--hp-accent)" }} />
                    <span className="text-sm" style={{ color: "var(--hp-text)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleCta}
                className="hp-cta-btn px-6 py-3 rounded-full text-sm flex items-center gap-2"
              >
                {!loading && currentUser ? t("ctaDashboard") : t("ctaStart")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t.rich("comparisonTitle", {
              accent: (chunks) => <span style={{ color: "var(--hp-accent)" }}>{chunks}</span>,
            })}
          </h2>
        </div>

        <div className="hp-glass rounded-2xl overflow-hidden max-w-3xl mx-auto hp-reveal hp-reveal-d1">
          <div className="overflow-x-auto">
            <table className="hp-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>{t("compareTraditional")}</th>
                  <th>{t("comparePugpip")}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="font-semibold" style={{ color: "var(--hp-text)" }}>{row.feature}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 shrink-0" style={{ color: "#c4493c" }} />
                        {row.old}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#6b8f71" }} />
                        {row.pugpip}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t.rich("pricingTitle", {
              accent: (chunks) => <span style={{ color: "var(--hp-accent)" }}>{chunks}</span>,
            })}
          </h2>
          <p
            className="text-base max-w-xl mx-auto hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            {t("pricingSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`hp-reveal hp-reveal-d${i} relative rounded-2xl p-6 sm:p-8 flex flex-col ${
                plan.accent ? "" : "hp-glass"
              }`}
              style={
                plan.accent
                  ? {
                      background: "#ffffff",
                      border: "2px solid var(--hp-accent)",
                      boxShadow: "0 8px 32px rgba(184, 112, 59, 0.12), 0 1px 3px rgba(0,0,0,0.04)",
                    }
                  : undefined
              }
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: "var(--hp-accent)" }}
                >
                  {t("mostPopular")}
                </div>
              )}

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: plan.accent ? "var(--hp-accent-glow)" : "rgba(0,0,0,0.03)",
                }}
              >
                <plan.icon
                  className="w-5 h-5"
                  style={{
                    color: plan.accent ? "var(--hp-accent)" : "var(--hp-text-muted)",
                  }}
                />
              </div>

              <p
                className="text-xs uppercase tracking-widest font-bold mb-3"
                style={{ color: plan.accent ? "var(--hp-accent)" : "var(--hp-text-muted)" }}
              >
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--hp-text)" }}>
                  {plan.price}
                </span>
                <span className="text-sm" style={{ color: "var(--hp-text-muted)" }}>
                  {plan.period}
                </span>
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--hp-text-muted)" }}>
                {plan.description}
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--hp-text)" }}>
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.accent ? "var(--hp-accent)" : "var(--hp-text-muted)" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleCta}
                className={`w-full py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  plan.accent ? "hp-cta-btn" : "border"
                }`}
                style={
                  plan.accent
                    ? undefined
                    : {
                        borderColor: "var(--hp-border)",
                        color: "var(--hp-text)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!plan.accent) {
                    e.currentTarget.style.borderColor = "var(--hp-accent)";
                    e.currentTarget.style.color = "var(--hp-accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.accent) {
                    e.currentTarget.style.borderColor = "var(--hp-border)";
                    e.currentTarget.style.color = "var(--hp-text)";
                  }
                }}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10 hp-reveal hp-reveal-d5">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--hp-text-muted)" }}>
              <Shield className="w-3.5 h-3.5" style={{ color: "var(--hp-accent)" }} />
              {badge}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 hp-reveal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t.rich("testimonialsTitle", {
              accent: (chunks) => <span style={{ color: "var(--hp-accent)" }}>{chunks}</span>,
            })}
          </h2>
          <p
            className="text-base hp-reveal hp-reveal-d1"
            style={{ color: "var(--hp-text-muted)" }}
          >
            {t("testimonialsSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.name}
              className={`hp-glass rounded-2xl p-6 relative overflow-hidden hp-reveal hp-reveal-d${i + 1}`}
            >
              {/* Accent bar */}
              <div
                className="hp-testimonial-bar"
                style={{ background: testimonial.color }}
              />
              <div className="pl-4">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5"
                      style={{ color: testimonial.color }}
                      fill={testimonial.color}
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-5 italic"
                  style={{ color: "var(--hp-text-muted)" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `${testimonial.color}20`,
                      color: testimonial.color,
                    }}
                  >
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--hp-text)" }}
                    >
                      {testimonial.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--hp-text-muted)" }}>
                      {t("scored")} {testimonial.score} &middot; {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 text-center px-4 sm:px-6">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(199,139,60,0.08) 0%, transparent 70%)",
          }}
        />
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative hp-reveal"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {t("finalCtaTitle1")}
          <br />
          <span style={{ color: "var(--hp-accent)" }}>{t("finalCtaTitleAccent")}</span>
        </h2>
        <p
          className="text-base mb-4 relative hp-reveal hp-reveal-d1"
          style={{ color: "var(--hp-text-muted)" }}
        >
          {t("finalCtaDesc")}
        </p>
        <p
          className="text-sm mb-8 relative hp-reveal hp-reveal-d2 italic max-w-lg mx-auto"
          style={{ color: "var(--hp-text-muted)" }}
        >
          {t("finalCtaQuote")}
        </p>
        <button
          onClick={handleCta}
          className="hp-cta-btn px-10 py-5 rounded-full text-lg flex items-center gap-3 mx-auto relative hp-reveal hp-reveal-d3"
        >
          {!loading && currentUser ? t("ctaDashboard") : t("ctaStart")}
          <ArrowRight className="w-5 h-5" />
        </button>
        <p
          className="text-xs mt-4 relative hp-reveal hp-reveal-d4"
          style={{ color: "var(--hp-text-muted)" }}
        >
          {t("noCreditCard")}
        </p>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="relative z-10 pb-10">
        <div
          className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-8 flex justify-between items-center"
          style={{
            borderTop: "1px solid var(--hp-border)",
          }}
        >
          <span
            className="text-xs tracking-widest"
            style={{ color: "var(--hp-text-muted)" }}
          >
            PugPIP
          </span>
          <span className="text-xs" style={{ color: "var(--hp-text-muted)" }}>
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  );
}
