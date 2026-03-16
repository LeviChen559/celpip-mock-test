"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      router.push("/dashboard");
    }
  }, [loading, currentUser, router]);

  if (loading) return null;
  if (currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        if (!name.trim()) { setError("Name is required."); setSubmitting(false); return; }
        if (!email.trim()) { setError("Email is required."); setSubmitting(false); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); setSubmitting(false); return; }
        const err = await signUp(name.trim(), email.trim().toLowerCase(), password);
        if (err) { setError(err); setSubmitting(false); return; }
      } else {
        if (!email.trim()) { setError("Email is required."); setSubmitting(false); return; }
        if (!password) { setError("Password is required."); setSubmitting(false); return; }
        const err = await signIn(email.trim().toLowerCase(), password);
        if (err) { setError(err); setSubmitting(false); return; }
      }
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-grid flex items-center justify-center px-4" style={{ backgroundColor: "var(--background)" }}>
      <Card className="w-full max-w-md border-2 border-[#e2ddd5] rounded-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {mode === "login"
                ? "Sign in to track your test results and schedule."
                : "Join to save your progress and study plan."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 4 characters" : "Your password"}
                className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#6b4c9a] transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full bg-[#6b4c9a] hover:bg-[#5a3d85] text-white py-5"
            >
              {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-5">
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-sm font-medium text-[#6b4c9a] hover:underline"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
