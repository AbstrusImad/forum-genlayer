import type { Metadata } from 'next'
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FORUM - AI-Moderated Debate on GenLayer',
  description: 'Submit arguments on controversial topics. AI validators judge quality under GenLayer consensus. Build your deliberation reputation.',
  openGraph: {
    title: 'FORUM - AI-Moderated Debate on GenLayer',
    description: 'AI-powered debate platform where validators reach consensus on argument quality.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-screen bg-paper-100 text-ink-900 antialiased">
        {children}
      </body>
    </html>
  )
}
