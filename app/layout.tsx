import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { LayoutChrome } from '@/components/ui/LayoutChrome'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' })

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
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-ash text-wheat font-body selection:bg-growth selection:text-parchment" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[2200] focus:px-4 focus:py-2 focus:bg-growth focus:text-parchment focus:rounded-md"
        >
          Skip to main content
        </a>
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
