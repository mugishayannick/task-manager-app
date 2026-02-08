import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { MainLayout } from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Manager - HR Tasks Hub',
  description: 'Manage your tasks efficiently with our powerful task management application',
  applicationName: 'Task Manager',
  keywords: ['tasks', 'kanban', 'productivity', 'management'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
