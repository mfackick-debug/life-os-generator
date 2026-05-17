import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life OS Generator",
  description: "顔写真×生年月日から、あなたの「勝ちパターン」をAIが構造化。努力を成果に直結させるための、具体的なネクストアクションを導き出します。",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <main className="flex-grow flex flex-col">{children}</main>
      </body>
    </html>
  );
}
