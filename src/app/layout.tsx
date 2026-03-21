import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CELPIP ACE",
  description: "Practice for the CELPIP General Test with full-length mock tests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${geistMono.variable} ${dmSerif.variable} antialiased font-sans`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
