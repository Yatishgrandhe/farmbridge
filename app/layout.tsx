import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Navigation } from '@/components/ui/Navigation'
import { SiteFooter } from '@/components/ui/SiteFooter'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'FarmBridge | NC Agriculture Crisis Response',
  description: 'Connecting North Carolina farmers to federal relief programs, drought data, and community support.',
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
        <Navigation />
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  )
}
