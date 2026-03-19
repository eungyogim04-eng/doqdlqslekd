import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Postly — SNS 루틴 다이어리",
  description: "Instagram, Twitter/X, YouTube 포스트를 캘린더로 관리하고 AI로 자동 작성하세요. 크리에이터를 위한 SNS 루틴 다이어리.",
  manifest: "/manifest.json",
  keywords: ["소셜 미디어 스케줄러", "SNS 예약", "인스타그램 예약", "트위터 예약", "AI 글쓰기", "콘텐츠 관리"],
  openGraph: {
    title: "Postly — SNS 루틴 다이어리",
    description: "매일 기록하고 쌓아가는 SNS 루틴 다이어리",
    type: "website",
    locale: "ko_KR",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Postly",
  },
  themeColor: "#A78BFA",
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
        <meta name="theme-color" content="#A78BFA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Postly" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
