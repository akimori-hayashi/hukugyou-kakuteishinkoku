import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '副業確定申告 税額簡易シミュレーター',
  description:
    '副業収入の確定申告要否と税額を簡易計算できるシミュレーターです。2025年度税制に基づく概算計算ツール。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
