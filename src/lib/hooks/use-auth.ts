"use client";

import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider(): AuthContextType {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (user: User): Promise<AppUser> => {
      const fallbackName = user.user_metadata?.name || user.email?.split("@")[0] || "";
      const fallbackEmail = user.email || "";

      // Use server API — avoids client-side RLS issues entirely
      try {
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          const profile = await res.json();
          console.log("[useAuth] profile loaded via API:", { id: user.id, role: profile.role });
          return { id: user.id, name: profile.name || fallbackName, email: profile.email || fallbackEmail, role: profile.role ?? "subscriber" };
        }
      } catch (e) {
        console.log("[useAuth] API fetch failed:", e);
      }

      // API failed — return basic info from auth metadata
      console.log("[useAuth] using auth metadata fallback");
      return { id: user.id, name: fallbackName, email: fallbackEmail, role: "subscriber" };
    };

    let initialSessionHandled = false;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: { user: User } | null } }) => {
      initialSessionHandled = true;
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user);
          if (mounted) setCurrentUser(profile);
        } catch (e) {
          console.log("[useAuth] fetchProfile error:", e);
        }
      }
      if (mounted) setLoading(false);
    }).catch(() => {
      initialSessionHandled = true;
      if (mounted) setLoading(false);
    });

    // Listen for subsequent auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: { user: User } | null) => {
      // Skip if getSession already handled the initial load
      if (!initialSessionHandled) return;
      if (session?.user) {
        try {
          const profile = await fetchProfile(session.user);
          if (mounted) setCurrentUser(profile);
        } catch (e) {
          console.log("[useAuth] fetchProfile error on auth change:", e);
        }
      } else {
        if (mounted) setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<string | null> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return error.message;
      return null;
    },
    [supabase]
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return error.message;
      return null;
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }, [supabase]);


  return { currentUser, loading, signUp, signIn, signOut };
}
