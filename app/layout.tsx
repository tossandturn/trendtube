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
  title: "TubeFission — Discover Viral YouTube Trends Before They Explode",
  description:
    "Discover exploding YouTube trends, viral Shorts, and creator opportunities before everyone else. Updated daily with AI analysis.",
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
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <RegionBar />
        {children}
      </body>
    </html>
  );
}
