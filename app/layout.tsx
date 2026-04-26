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
        <LayoutChrome>{children}</LayoutChrome>
      </body>
    </html>
  )
}
