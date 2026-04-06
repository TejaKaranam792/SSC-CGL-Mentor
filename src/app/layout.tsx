import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSC CGL Elite Mentor | AI Performance Coach",
  description: "Strict, AI-powered SSC CGL mentor. Analyze your mock tests, detect weak topics, and get a brutal 1-day action plan to maximize your score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      {/* Anti-flash: apply stored theme before React hydrates */}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('ssc_theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        <Navbar />
        {/* pt-14 on mobile (smaller top bar), pt-16 on desktop; pb-20 on mobile for bottom tab bar */}
        <div className="pt-14 md:pt-16 pb-20 md:pb-0 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
