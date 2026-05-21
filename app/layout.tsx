import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life OS",
  description: "顔写真と生年月日から、AIがあなた専用の意思決定戦略を導き出します。",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Life OS",
    description: "顔写真と生年月日から、AIがあなた専用の意思決定戦略を導き出します。",
    type: "website",
    locale: "ja_JP",
    url: "https://life-os-generator.vercel.app",
    siteName: "Life OS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Life OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life OS",
    description: "顔写真と生年月日から、AIがあなた専用の意思決定戦略を導き出します。",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <main className="flex-grow flex flex-col">{children}</main>
      </body>
    </html>
  );
}
