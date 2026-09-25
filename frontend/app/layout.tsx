import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@livekit/components-styles";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Svara | Jothsana Waikar",
  description: "Talk to Svara, Jothsana Waikar's live voice twin, about her work, decisions, and experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
