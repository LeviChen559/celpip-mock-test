"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Crown,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic practice",
    icon: Zap,
    accent: false,
    features: [
      "15 test credits / month",
      "Reading quiz: 1 credit, Listening: 2",
      "Writing quiz: 3 credits, Speaking: 2",
      "Basic study dashboard",
      "Community support",
    ],
    cta: "Continue Free",
  },
  {
    id: "improver",
    name: "Improver",
    price: "$12",
    period: "/ month",
    description: "AI-powered feedback to level up fast",
    icon: Sparkles,
    accent: true,
    popular: true,
    features: [
      "100 test credits / month",
      "AI writing scoring & feedback",
      "AI speaking evaluation",
      "Personalized study plan",
      "Diagnostic assessment",
      "Priority support",
    ],
    cta: "Get Improver",
  },
  {
    id: "intensive",
    name: "Intensive",
    price: "$29",
    period: "/ month",
    description: "Maximum preparation for test day",
    icon: Shield,
    accent: false,
    features: [
      "500 test credits / month",
      "Everything in Improver",
      "Real-time writing feedback",
      "Advanced analytics & trends",
      "Speaking practice with AI coach",
      "Dedicated support",
    ],
    cta: "Get Intensive",
  },
  {
    id: "guarantee",
    name: "Score Guarantee",
    price: "$79",
    period: "one-time",
    description: "90-day unlimited access with confidence",
    icon: Crown,
    accent: false,
    features: [
      "Unlimited test credits for 90 days",
      "Everything in Intensive",
      "Teacher review sessions",
      "Custom study schedule",
      "Score improvement guarantee",
      "1-on-1 support channel",
    ],
    cta: "Get Guarantee",
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/signup");
    }
  }, [loading, currentUser, router]);

  if (loading || !currentUser) {
    return (
      <main className="homepage bg-grid min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--hp-accent)" }}
        />
      </main>
    );
  }

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      router.push("/dashboard");
    }
    // Paid plans: placeholder — payment integration will go here
  };

  return (
    <main className="homepage bg-grid min-h-screen relative px-4 py-12 md:py-20">
      {/* Grain */}
      <div className="hp-grain" />

      {/* Background meshes */}
      <div
        className="hp-mesh"
        style={{
          width: 600,
          height: 600,
          top: -150,
          right: -200,
          background:
            "radial-gradient(circle, rgba(184,112,59,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="hp-mesh"
        style={{
          width: 500,
          height: 500,
          bottom: -100,
          left: -150,
          background:
            "radial-gradient(circle, rgba(107,76,154,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="hp-mesh"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          left: "50%",
          background:
            "radial-gradient(circle, rgba(107,143,113,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Decorative rings */}
      <div
        className="hp-deco-ring"
        style={{ width: 350, height: 350, top: "5%", right: -140 }}
      />
      <div
        className="hp-deco-ring"
        style={{ width: 250, height: 250, bottom: "10%", left: -100 }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div
            className="relative inline-block mb-5 hp-reveal"
            style={{ animation: "hp-float 5s ease-in-out infinite" }}
          >
            <Image
              src="/puggy-happy.png"
              alt="PugPIP mascot"
              width={80}
              height={80}
              className="drop-shadow-md"
            />
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-3 hp-reveal hp-reveal-d1"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--hp-text)",
            }}
          >
            Choose Your Plan
          </h1>
          <p
            className="text-base md:text-lg max-w-lg mx-auto hp-reveal hp-reveal-d2"
            style={{ color: "var(--hp-text-muted)" }}
          >
            Welcome, {currentUser.name || "there"}! Pick the plan that fits your
            CELPIP preparation goals.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`hp-reveal hp-reveal-d${i + 2} relative rounded-3xl p-6 flex flex-col transition-all duration-300 ${
                plan.accent
                  ? "ring-2 shadow-lg scale-[1.02] md:scale-105"
                  : "hp-glass"
              }`}
              style={
                plan.accent
                  ? {
                      background: "#ffffff",
                      borderColor: "var(--hp-accent)",
                      boxShadow:
                        "0 8px 32px rgba(184, 112, 59, 0.12), 0 1px 3px rgba(0,0,0,0.04)",
                      // Ring via outline since ring utility needs Tailwind config
                      outline: "2px solid var(--hp-accent)",
                      outlineOffset: "-2px",
                    }
                  : undefined
              }
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: "var(--hp-accent)" }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: plan.accent
                    ? "var(--hp-accent-glow)"
                    : "rgba(0,0,0,0.03)",
                }}
              >
                <plan.icon
                  className="w-5 h-5"
                  style={{
                    color: plan.accent
                      ? "var(--hp-accent)"
                      : "var(--hp-text-muted)",
                  }}
                />
              </div>

              {/* Plan name & price */}
              <h3
                className="text-lg font-bold mb-1"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--hp-text)",
                }}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-3xl font-bold"
                  style={{
                    color: plan.accent
                      ? "var(--hp-accent)"
                      : "var(--hp-text)",
                  }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--hp-text-muted)" }}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className="text-sm mb-5"
                style={{ color: "var(--hp-text-muted)" }}
              >
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{
                        color: plan.accent
                          ? "var(--hp-accent)"
                          : "var(--hp-text-muted)",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--hp-text)" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  plan.accent ? "hp-cta-btn" : ""
                }`}
                style={
                  plan.accent
                    ? undefined
                    : {
                        background: "transparent",
                        border: "1px solid var(--hp-border)",
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

        {/* Skip / Free tier link */}
        <div className="text-center hp-reveal hp-reveal-d7">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium transition-colors inline-flex items-center gap-1.5"
            style={{ color: "var(--hp-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--hp-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--hp-text-muted)")
            }
          >
            Skip for now — continue with free account
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10 hp-reveal hp-reveal-d8">
          {[
            "Cancel anytime",
            "Secure payment",
            "7-day money-back guarantee",
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-xs font-medium"
              style={{ color: "var(--hp-text-muted)" }}
            >
              <Shield className="w-3.5 h-3.5" style={{ color: "var(--hp-accent)" }} />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
