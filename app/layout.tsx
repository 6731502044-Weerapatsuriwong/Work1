import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gravity Meter Dashboard',
  description: 'Monitor soil moisture with a gravity-based visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-600 to-purple-700 min-h-screen">
        {children}
      </body>
    </html>
  )
}
