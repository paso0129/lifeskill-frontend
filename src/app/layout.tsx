import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '생활체육 - 초등 체육 활동',
  description: '초등학생을 위한 체육 활동 참여 및 인증 플랫폼',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard antialiased bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
