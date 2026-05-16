import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClauseIQ - AI-Powered Legal Document Analyzer",
  description: "Understand Contracts Before You Sign. AI-powered contract analysis, risk detection, and negotiation assistance.",
  keywords: ["legal", "contract", "AI", "analysis", "risk", "SaaS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 15, 35, 0.9)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              color: '#e2e8f0',
            },
          }}
        />
      </body>
    </html>
  );
}
