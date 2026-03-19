import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postly — 소셜 미디어 스케줄러",
  description: "Instagram, Twitter/X, YouTube 포스트를 캘린더로 관리하고 AI로 자동 작성하세요. 크리에이터를 위한 가장 똑똑한 소셜 미디어 스케줄러.",
  manifest: "/manifest.json",
  keywords: ["소셜 미디어 스케줄러", "SNS 예약", "인스타그램 예약", "트위터 예약", "AI 글쓰기", "콘텐츠 관리"],
  openGraph: {
    title: "Postly — 소셜 미디어 스케줄러",
    description: "Instagram, Twitter/X, YouTube 포스트를 캘린더로 관리하고 AI로 자동 작성하세요.",
    type: "website",
    locale: "ko_KR",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Postly",
  },
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Postly" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
