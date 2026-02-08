'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Zap,
  Mail,
  Calendar,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Plus,
  MoreVertical,
  GripVertical,
} from 'lucide-react'
import { useThemeContext } from '@/lib/providers/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SUPPORTED_LANGUAGES } from '@/lib/constants'

interface SidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme, mounted } = useThemeContext()

  const [systemDark, setSystemDark] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)
    const handler = () => setSystemDark(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const effectiveTheme = React.useMemo((): 'light' | 'dark' => {
    if (!mounted) return 'light'
    if (theme === 'system') return systemDark ? 'dark' : 'light'
    return theme as 'light' | 'dark'
  }, [theme, mounted, systemDark])

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    shared: true,
    private: true,
  })

  const navigationItems = [
    { id: 'search', label: t('sidebar.search'), icon: Search },
    { id: 'ai', label: t('sidebar.ai'), icon: Zap },
    { id: 'inbox', label: t('sidebar.inbox'), icon: Mail, badge: 'New' },
    { id: 'calendar', label: t('sidebar.calendar'), icon: Calendar },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings },
  ]

  const sharedPages = [
    { name: 'HR Tasks Hub', initial: 'H', color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
    { name: 'Windah Comp', initial: 'W', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { name: 'NoSpace Dev', initial: 'N', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
  ]

  const privatePages = [
    { name: 'Dribble Portfolio', initial: 'D', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
  ]

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const toggleCollapse = () => {
    onCollapse?.(!collapsed)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={`h-full md:h-screen bg-background md:border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[68px]' : 'w-full md:w-64'
        }`}
      >
        {/* Header */}
        <div className={`border-b border-border flex items-center ${collapsed ? 'p-3 justify-center' : 'p-4 pt-5 md:pt-4 justify-between'}`}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleCollapse}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-purple-500/20"
                >
                  <Sun size={22} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Expand sidebar</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-purple-500/20">
                  <Sun size={22} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold text-foreground leading-tight truncate">Kllaboard</h1>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full inline-block flex-shrink-0" />
                    free-trial
                  </p>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground flex-shrink-0 hidden md:inline-flex"
                title="Collapse sidebar"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <nav className={`py-3 space-y-0.5 ${collapsed ? 'px-2' : 'px-4'}`}>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return collapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button className="w-full flex items-center justify-center p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150 relative">
                    <Icon size={20} className="flex-shrink-0" strokeWidth={1.5} />
                    {item.badge && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                key={item.id}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/15 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto py-4 space-y-6 border-t border-border ${collapsed ? 'px-2' : 'px-4'}`}>
          {/* Shared Pages */}
          <div>
            {!collapsed && (
              <button
                onClick={() => toggleSection('shared')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('sidebar.sharedPages')}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${expandedSections.shared ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
            )}
            {(collapsed || expandedSections.shared) && (
              <div className={`space-y-1 ${collapsed ? '' : 'mt-2'}`}>
                {sharedPages.map((page, idx) =>
                  collapsed ? (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${page.color}`}>
                            {page.initial}
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{page.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                    >
                      <GripVertical size={16} className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-muted-foreground transition-opacity" strokeWidth={1.5} />
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${page.color}`}>
                        {page.initial}
                      </div>
                      <span className="text-sm text-foreground truncate">{page.name}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Private Pages */}
          <div>
            {!collapsed && (
              <button
                onClick={() => toggleSection('private')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('sidebar.privatePages')}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${expandedSections.private ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
            )}
            {(collapsed || expandedSections.private) && (
              <div className={`space-y-1 ${collapsed ? '' : 'mt-2'}`}>
                {privatePages.map((page, idx) =>
                  collapsed ? (
                    <Tooltip key={idx}>
                      <TooltipTrigger asChild>
                        <button className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${page.color}`}>
                            {page.initial}
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{page.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      key={idx}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                    >
                      <GripVertical size={16} className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-muted-foreground transition-opacity" strokeWidth={1.5} />
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${page.color}`}>
                        {page.initial}
                      </div>
                      <span className="text-sm text-foreground truncate">{page.name}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t border-border flex flex-col ${collapsed ? 'p-2 space-y-2' : 'p-3 md:p-4 space-y-3 md:space-y-4'}`}>
          {collapsed ? (
            <>
              {/* Collapsed: account avatar */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="w-full flex items-center justify-center p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                      T
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tehran</p>
                </TooltipContent>
              </Tooltip>

              {/* Collapsed: theme toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="w-full flex items-center justify-center p-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    {effectiveTheme === 'dark' ? (
                      <Sun size={18} className="text-amber-500" strokeWidth={1.5} />
                    ) : (
                      <Moon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{effectiveTheme === 'dark' ? 'Light mode' : 'Dark mode'}</p>
                </TooltipContent>
              </Tooltip>

              {/* Collapsed: expand button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleCollapse}
                    className="w-full flex items-center justify-center p-2.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              {/* Accounts */}
              <div>
                <div className="flex items-center justify-between px-2 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {t('sidebar.accounts')}
                  </span>
                  <button className="p-1 hover:bg-muted rounded transition-colors">
                    <Plus size={16} className="text-muted-foreground" strokeWidth={2} />
                  </button>
                </div>
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                      T
                    </div>
                    <span className="text-sm font-semibold text-foreground">Tehran</span>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    className="p-1 hover:bg-background rounded transition-colors flex-shrink-0 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') e.stopPropagation()
                    }}
                  >
                    <MoreVertical size={16} className="text-muted-foreground" strokeWidth={2} />
                  </span>
                </button>
              </div>

              {/* Upgrade Card */}
              <div className="p-4 bg-gradient-to-b from-pink-400 via-purple-500 to-blue-600 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300/20 via-purple-300/10 to-transparent pointer-events-none" />

                <div className="flex justify-center relative z-10">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
                    <Sun size={24} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="text-center space-y-1.5 relative z-10">
                  <h3 className="text-sm font-bold text-white">{t('sidebar.upgradeTitle')}</h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {t('sidebar.upgradeDescription')}
                  </p>
                </div>

                <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 h-auto rounded-lg relative z-10">
                  {t('sidebar.upgrade')}
                </Button>
              </div>

              {/* Theme & Language */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="flex-1 flex items-center justify-center p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  {effectiveTheme === 'dark' ? (
                    <Sun size={18} className="text-amber-500" strokeWidth={1.5} />
                  ) : (
                    <Moon size={18} className="text-muted-foreground" strokeWidth={1.5} />
                  )}
                </button>
                <div className="flex-1 flex items-center gap-1 border border-border rounded-lg p-1">
                  {Object.entries(SUPPORTED_LANGUAGES).map(([key]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange(key.toLowerCase())}
                      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded transition-all duration-150 ${
                        i18n.language === key.toLowerCase()
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
