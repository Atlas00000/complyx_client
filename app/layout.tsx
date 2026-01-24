import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ThemeProvider from '@/components/providers/ThemeProvider'
import QueryProvider from '@/components/providers/QueryProvider'
import { themeScript } from './theme-script'

// Optimize font loading with display swap and preload
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Show fallback font while loading
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Complyx - IFRS S1 & S2 Readiness Assessment',
  description: 'AI-powered conversational assistant for IFRS standards and accounting knowledge, with expertise in IFRS S1 & S2 compliance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="smooth-scroll">
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
