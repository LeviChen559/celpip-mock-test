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
  title: {
    default: "PugPIP – Free Mock Tests & Practice for English Proficiency",
    template: "%s | PugPIP",
  },
  description:
    "Prepare for your English proficiency test with PugPIP. Full-length mock tests covering Listening, Reading, Writing, and Speaking with instant scoring and detailed feedback.",
  keywords: [
    "PugPIP",
    "English proficiency test",
    "mock test",
    "listening practice",
    "reading practice",
    "writing practice",
    "speaking practice",
    "English test preparation",
    "free practice test",
  ],
  openGraph: {
    title: "PugPIP – Free Mock Tests & Practice for English Proficiency",
    description:
      "Full-length mock tests covering Listening, Reading, Writing, and Speaking with instant scoring and detailed feedback.",
    type: "website",
    locale: "en_US",
    siteName: "PugPIP",
  },
  twitter: {
    card: "summary_large_image",
    title: "PugPIP – Free Mock Tests & Practice for English Proficiency",
    description:
      "Full-length mock tests covering Listening, Reading, Writing, and Speaking with instant scoring and detailed feedback.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
