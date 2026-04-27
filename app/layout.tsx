import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { LayoutChrome } from '@/components/ui/LayoutChrome'

export const metadata: Metadata = {
  title: 'FarmBridge | US Agriculture Crisis Response',
  description: 'Connecting farmers across the United States to relief programs, drought data, and community support.',
  metadataBase: new URL('https://farmbridge.us'),
  openGraph: {
    title: 'FarmBridge | US Agriculture Crisis Response',
    description: 'Find relief programs, county risk signals, and application guidance for farmers.',
    url: 'https://farmbridge.us',
    siteName: 'FarmBridge',
    images: [
      {
        url: '/logo-mark.png',
        width: 1200,
        height: 1200,
        alt: 'FarmBridge logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmBridge | US Agriculture Crisis Response',
    description: 'Find relief programs, county risk signals, and application guidance for farmers.',
    images: ['/logo-mark.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo-mark.png',
    shortcut: '/logo-mark.png',
    apple: '/logo-mark.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('js-enabled');
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              window.addEventListener('load', function () {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              });
            `,
          }}
        />
        <LayoutChrome>{children}</LayoutChrome>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'FarmBridge',
              url: 'https://farmbridge.us',
              logo: 'https://farmbridge.us/logo-mark.png',
              description: 'US agriculture crisis response platform for relief navigation and county-level risk context.',
            }),
          }}
        />
      </body>
    </html>
  )
}
