import type { Metadata } from "next";
import Script from "next/script";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Source_Serif_4,
} from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ui = IBM_Plex_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OnPointTracker",
  description:
    "Track Congress, the executive branch, and live legislation in a black-and-white editorial interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${ui.variable} ${mono.variable} antialiased`}
      >
        <div className="min-h-screen bg-paper text-ink">
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-12">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
