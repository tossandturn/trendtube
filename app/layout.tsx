import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RegionBar from "./components/RegionBar";
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
  title: "YouTube Video Downloader & Analytics Tool | Tubefission",
  description:
    "Download YouTube videos without watermark instantly. Analyze channels, trends, and top-performing content using Tubefission. Free, fast, and secure.",
  keywords: [
    "YouTube downloader",
    "free YouTube download",
    "YouTube video downloader",
    "download YouTube MP4",
    "YouTube channel analytics",
    "viral trends",
    "YouTube analytics tool",
  ],
  alternates: {
    canonical: "https://tubefission.com",
  },
  openGraph: {
    title: "YouTube Video Downloader & Analytics Tool | Tubefission",
    description: "Download YouTube videos without watermark instantly. Analyze channels, trends, and top-performing content.",
    url: "https://tubefission.com",
    siteName: "Tubefission",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Downloader & Analytics Tool | Tubefission",
    description: "Download YouTube videos without watermark instantly. Analyze channels and trends.",
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
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6772936350717773"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-6772936350717773" />
        {/* Plausible Analytics */}
        <script defer data-domain="tubefission.com" src="https://plausible.io/js/script.js" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <RegionBar />
        {children}
      </body>
    </html>
  );
}
