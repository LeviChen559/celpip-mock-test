"use client";

import { AuthContext, useAuthProvider } from "@/lib/hooks/use-auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
