import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegionBar from "./components/RegionBar";
import VideoAnalyzerBar from "./components/VideoAnalyzerBar";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { getRegion } from "@/lib/region-server";
import { REGION_META } from "@/lib/region";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube AI Analytics & Trend Intelligence Platform | Tubefission",
  description:
    "AI-powered YouTube analytics platform. Analyze channels, discover viral trends, track competitor performance, and get data-driven content insights. Free, no registration.",
  keywords: [
    "YouTube analytics",
    "YouTube AI analysis",
    "channel analytics",
    "viral trend discovery",
    "competitor research",
    "YouTube growth tool",
    "content strategy",
  ],
  alternates: {
    canonical: "https://tubefission.com",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    shortcut: '/favicon.ico',
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#FF0000' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#FF0000',
    'msapplication-config': '/browserconfig.xml',
  },
  openGraph: {
    title: "YouTube AI Analytics & Trend Intelligence Platform | Tubefission",
    description: "AI-powered YouTube analytics platform. Analyze channels, discover viral trends, track competitor performance.",
    url: "https://tubefission.com",
    siteName: "Tubefission",
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TubeFission - YouTube AI Analytics Platform',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube AI Analytics & Trend Intelligence Platform | Tubefission",
    description: "AI-powered YouTube analytics platform. Analyze channels, discover viral trends, track competitor performance.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const region = await getRegion();
  const lang = REGION_META[region].lang;

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2329966945529740"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-2329966945529740" />
        {/* Plausible Analytics */}
        <script defer data-domain="tubefission.com" src="https://plausible.io/js/script.js" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <PerformanceMonitor />
        <RegionBar />
        <VideoAnalyzerBar />
        {children}
      </body>
    </html>
  );
}
