'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n/config'
import { ThemeProvider } from '@/lib/providers/ThemeProvider'
import { SidebarProvider } from '@/lib/providers/SidebarProvider'
import { Sidebar } from './Sidebar'
import { Toaster } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const isMobile = useIsMobile()

  const openMobileSidebar = React.useCallback(() => {
    setMobileSidebarOpen(true)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SidebarProvider isMobile={isMobile} openMobileSidebar={openMobileSidebar}>
            <div className="flex h-screen bg-background text-foreground overflow-hidden">
              {/* Desktop Sidebar */}
              {!isMobile && (
                <Sidebar
                  collapsed={sidebarCollapsed}
                  onCollapse={setSidebarCollapsed}
                />
              )}

              {/* Mobile Sidebar as Sheet Drawer */}
              {isMobile && (
                <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                  <SheetContent side="left" className="p-0 w-72 sm:max-w-72">
                    <VisuallyHidden.Root>
                      <SheetTitle>Navigation</SheetTitle>
                    </VisuallyHidden.Root>
                    <Sidebar
                      collapsed={false}
                      onCollapse={() => setMobileSidebarOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              )}

              {/* Main Content */}
              <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                {children}
              </div>

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  duration: 3000,
                  classNames: {
                    toast: 'bg-card border border-border text-foreground shadow-lg',
                    success: 'border-emerald-500/20',
                    error: 'border-destructive/20',
                  },
                }}
              />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
