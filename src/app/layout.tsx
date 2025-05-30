import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeForge | AI-Powered Rules & Prompts for Professional Vibecoding",
  description: "Generate comprehensive AI assistant rules, development prompts, and project structures for Cursor and Windsurf IDEs. Accelerate your AI-assisted development workflow.",
  keywords: ["AI coding", "Cursor IDE", "Windsurf IDE", "development prompts", "AI rules", "vibecoding", "AI assistant"],
  authors: [{ name: "Victor Gulchenko", url: "https://x.com/VictorGulchenko" }],
  creator: "Victor Gulchenko",
  openGraph: {
    title: "VibeForge | AI-Powered Rules & Prompts for Professional Vibecoding",
    description: "Generate comprehensive AI assistant rules, development prompts, and project structures for Cursor and Windsurf IDEs.",
    url: "https://vibeforge.dev",
    siteName: "VibeForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeForge | AI-Powered Rules & Prompts for Professional Vibecoding",
    description: "Generate comprehensive AI assistant rules, development prompts, and project structures for Cursor and Windsurf IDEs.",
    creator: "@VictorGulchenko",
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
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
