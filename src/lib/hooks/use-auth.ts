"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  name: string;
  email: string;
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
  const supabase = createClient();

  // Fetch profile from public.profiles
  const fetchProfile = useCallback(
    async (user: User): Promise<AppUser | null> => {
      const { data } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", user.id)
        .single();
      if (!data) return null;
      return { id: user.id, name: data.name, email: data.email };
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setCurrentUser(profile);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

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
