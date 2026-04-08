import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://lunchboss.pages.dev/';
const siteTitle = 'Lunch Boss | 즐거운 점심 결제 한판';
const siteDescription = '사다리, 룰렛, 셔플로 점심 결제 담당을 빠르게 정하는 Lunch Boss. 팀 점심 결제, 메뉴 추천, 커피 내기까지 한 번에 해결하세요.';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | Lunch Boss`,
  },
  description: siteDescription,
  keywords: ['점심 결제', '사다리타기', '룰렛', '점심 메뉴 추천', '커피 내기', '팀 점심', '점심값 계산', '복불복'],
  authors: [{ name: 'Lunch Boss Team' }],
  creator: 'Lunch Boss',
  publisher: 'Lunch Boss',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'Lunch Boss',
    locale: 'ko_KR',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Lunch Boss 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4269966166949156" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-4269966166949156" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w47wx3mav9");
            `,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TXHYQWL2B9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TXHYQWL2B9');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Lunch Boss",
              "url": siteUrl,
              "description": siteDescription,
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0"
              }
            }),
          }}
        />
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
