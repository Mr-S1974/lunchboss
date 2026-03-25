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
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Noto+Sans+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}