import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LayoutWrapper } from '@/components/site/layout-wrapper';
import { getSiteConfig } from '@/lib/db';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  
  return {
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: './',
    },
    title: {
      default: siteConfig.name,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      'branding agency',
      'digital studio',
      'web design',
      'product design',
      'creative agency',
      'tech startups',
      'brand strategy',
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      creator: '@tectoflowstudio',
    },
    icons: {
      icon: siteConfig.logoUrl || '/icon',
      shortcut: siteConfig.logoUrl || '/icon',
      apple: siteConfig.logoUrl || '/icon',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://cal.id" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper siteConfig={config}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
