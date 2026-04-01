import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PugPIP – Free CELPIP Mock Tests & Practice",
    template: "%s | PugPIP",
  },
  description:
    "Prepare for the CELPIP General Test with PugPIP. Full-length mock tests covering Listening, Reading, Writing, and Speaking with instant scoring and detailed feedback.",
  keywords: [
    "PugPIP",
    "CELPIP",
    "CELPIP mock test",
    "CELPIP practice test",
    "CELPIP General",
    "English proficiency test",
    "listening practice",
    "reading practice",
    "writing practice",
    "speaking practice",
    "English test preparation",
    "free practice test",
  ],
  openGraph: {
    title: "PugPIP – Free CELPIP Mock Tests & Practice",
    description:
      "Prepare for the CELPIP General Test with full-length mock tests covering Listening, Reading, Writing, and Speaking with instant scoring and detailed feedback.",
    type: "website",
    locale: "en_US",
    siteName: "PugPIP",
  },
  twitter: {
    card: "summary_large_image",
    title: "PugPIP – Free CELPIP Mock Tests & Practice",
    description:
      "Prepare for the CELPIP General Test with full-length mock tests covering Listening, Reading, Writing, and Speaking with instant scoring and detailed feedback.",
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
    <html suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${geistMono.variable} ${robotoSlab.variable} antialiased font-sans`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
