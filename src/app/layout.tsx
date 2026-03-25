import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lunch Boss | 즐거운 점심 결제 한판',
  description: '누가 오늘 점심의 주인공이 될까요? Lunch Boss와 함께 결정하세요!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Space+Grotesk:wght@500;700&family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
