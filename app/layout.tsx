import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { DebugWrapper } from '@/components/DebugWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MathWhiteboard - Collaborative Math Tutoring',
  description: 'Real-time collaborative whiteboard for math tutoring with LaTeX support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DebugWrapper>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              // Ensure all values are renderable
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </DebugWrapper>
      </body>
    </html>
  )
}