"use client";

import { usePathname, useRouter } from "next/navigation";
import { Users, FileText, Flag, Home } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "User Management", icon: Users, match: (p: string) => p === "/admin" },
  { href: "/admin/content", label: "Content Management", icon: FileText, match: (p: string) => p.startsWith("/admin/content") },
  { href: "/admin/red-flags", label: "Red Flags", icon: Flag, match: (p: string) => p.startsWith("/admin/red-flags") },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-56 shrink-0 bg-white border-r border-[#e2ddd5] flex flex-col justify-between py-6 px-3">
      <div className="space-y-1">
        <p className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Admin</p>
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? "bg-[#6b4c9a]/10 text-[#6b4c9a]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </button>
    </aside>
  );
}
