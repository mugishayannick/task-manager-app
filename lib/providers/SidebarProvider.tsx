'use client'

import React, { createContext, useContext } from 'react'

interface SidebarContextType {
  isMobile: boolean
  openMobileSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{
  isMobile: boolean
  openMobileSidebar: () => void
  children: React.ReactNode
}> = ({ isMobile, openMobileSidebar, children }) => (
  <SidebarContext.Provider value={{ isMobile, openMobileSidebar }}>
    {children}
  </SidebarContext.Provider>
)

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within SidebarProvider')
  }
  return context
}
