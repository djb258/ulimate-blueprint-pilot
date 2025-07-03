import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "../components/NotificationSystem";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ultimate Blueprint Pilot",
  description: "Cockpit for designing micro-engineered blueprints",
  keywords: ["blueprint", "design", "development", "planning", "architecture"],
  authors: [{ name: "djb258" }],
  creator: "djb258",
  publisher: "Ultimate Blueprint Pilot",
  robots: "index, follow",
  openGraph: {
    title: "Ultimate Blueprint Pilot",
    description: "Cockpit for designing micro-engineered blueprints",
    type: "website",
    url: "https://ulimate-blueprint-pilot.vercel.app",
    siteName: "Ultimate Blueprint Pilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Blueprint Pilot",
    description: "Cockpit for designing micro-engineered blueprints",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
