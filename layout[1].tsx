import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { MaintenanceModeAlert } from '@/components/MaintenanceModeAlert'
import { Header } from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'AZIBO STUDIO - Create AI Videos',
  description:
    'AZIBO STUDIO lets you create high-quality AI videos from simple text prompts using powerful text-to-video AI.',

  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },

  keywords: [
    'AI video',
    'text to video',
    'AI video generator',
    'AI video creation',
    'video generation',
    'AI content creation',
    'viral videos',
  ],

  authors: [{ name: 'AZIBO STUDIO' }],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://azibo.studio',
    title: 'AZIBO STUDIO - Create AI Videos',
    description:y
      'Create high-quality AI videos from simple text prompts with AZIBO STUDIO.',
    siteName: 'AZIBO STUDIO',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'AZIBO STUDIO',
    description:
      'Create high-quality AI videos from text prompts with AZIBO STUDIO.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#ffd700',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background dark">
      <body className="antialiased bg-background text-foreground">
        <AnnouncementBanner />
        <MaintenanceModeAlert />
        <Header />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}