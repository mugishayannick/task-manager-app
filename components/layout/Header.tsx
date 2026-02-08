'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Star,
  MessageCircle,
  Clock,
  ChevronRight,
  Lock,
  Grid3x3,
  List,
  Calendar as CalendarIcon,
  Plus,
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  Menu,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebarContext } from '@/lib/providers/SidebarProvider'
import type { TaskStatus, SortOptions } from '@/types'

type FilterPreset = 'all' | TaskStatus

interface HeaderProps {
  title?: string
  description?: string
  onSearchChange?: (value: string) => void
  viewMode?: 'kanban' | 'list' | 'calendar'
  onViewModeChange?: (mode: 'kanban' | 'list' | 'calendar') => void
  activeFilter?: FilterPreset
  onFilterChange?: (filter: FilterPreset) => void
  activeSort?: SortOptions
  onSortChange?: (sort: SortOptions) => void
}

const FILTER_OPTIONS: { value: FilterPreset; labelKey: string }[] = [
  { value: 'all', labelKey: 'board.allTasks' },
  { value: 'todo', labelKey: 'status.todo' },
  { value: 'in_progress', labelKey: 'status.in_progress' },
  { value: 'need_review', labelKey: 'status.need_review' },
  { value: 'done', labelKey: 'board.completed' },
]

const SORT_OPTIONS: { field: SortOptions['field']; labelKey: string }[] = [
  { field: 'dueDate', labelKey: 'sort.dueDate' },
  { field: 'priority', labelKey: 'sort.priority' },
  { field: 'createdAt', labelKey: 'sort.createdAt' },
]

export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  onSearchChange,
  viewMode = 'kanban',
  onViewModeChange,
  activeFilter = 'all',
  onFilterChange,
  activeSort,
  onSortChange,
}) => {
  const { t } = useTranslation()
  const [isStarred, setIsStarred] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const { isMobile, openMobileSidebar } = useSidebarContext()

  const displayTitle = title || t('board.title')
  const displayDescription = description || t('board.welcome')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchChange?.(value)
  }

  const handleFilterChange = (filter: FilterPreset) => {
    onFilterChange?.(filter)
  }

  const handleSortChange = (field: SortOptions['field']) => {
    if (!activeSort || !onSortChange) return
    const isSameField = activeSort.field === field
    const newDirection = isSameField && activeSort.direction === 'asc' ? 'desc' : 'asc'
    onSortChange({ field, direction: newDirection })
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      {/* Top Breadcrumb Bar */}
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center justify-between border-b border-border/50 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isMobile && (
            <button
              type="button"
              onClick={openMobileSidebar}
              className="p-1.5 -ml-1 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              aria-label="Open sidebar"
            >
              <Menu size={20} className="text-foreground" strokeWidth={1.5} />
            </button>
          )}

          <button className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0">
            <Plus size={16} className="text-muted-foreground" strokeWidth={1.5} />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
            <div className="w-px h-5 bg-border/50 mr-0.5" />
            <Globe size={14} className="text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
            <button className="text-muted-foreground hover:text-foreground transition-colors text-xs truncate">
              {t('sidebar.sharedPages')}
            </button>
            <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" strokeWidth={2} />
            <button className="font-medium text-foreground text-xs truncate">
              {displayTitle}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button
            className="p-1.5 hover:bg-muted rounded transition-colors"
            onClick={() => setIsStarred(!isStarred)}
          >
            <Star
              size={16}
              className={isStarred ? 'text-amber-500' : 'text-muted-foreground'}
              strokeWidth={1.5}
              fill={isStarred ? 'currentColor' : 'none'}
            />
          </button>
          <button className="p-1.5 hover:bg-muted rounded transition-colors hidden sm:inline-flex">
            <MessageCircle size={16} className="text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div className="w-px h-4 bg-border/50 mx-1 hidden md:block" />
          <button className="p-1.5 hover:bg-muted rounded transition-colors hidden md:inline-flex">
            <Clock size={16} className="text-muted-foreground" strokeWidth={1.5} />
          </button>
          <Button variant="ghost" size="sm" className="ml-1 gap-1 h-7 px-2 text-xs font-medium hover:bg-muted hidden md:flex">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{t('board.share')}</span>
            <ChevronRight size={12} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {/* Title Section */}
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 space-y-1 border-b border-border/50">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight truncate">
            {displayTitle}
          </h1>
          <Lock size={16} className="text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground truncate">{displayDescription}</p>
      </div>

      {/* Controls Section */}
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 md:gap-4 border-b border-border/50">
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded transition-colors">
                <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>{t('board.moreOptions')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5 h-8 px-2 sm:px-3 text-xs"
            onClick={() => onViewModeChange?.('kanban')}
          >
            <Grid3x3 size={14} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="font-medium hidden sm:inline">{t('board.kanban')}</span>
          </Button>

          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5 h-8 px-2 sm:px-3 text-xs"
            onClick={() => onViewModeChange?.('list')}
          >
            <List size={14} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="font-medium hidden sm:inline">{t('board.list')}</span>
          </Button>

          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            className="gap-1.5 h-8 px-2 sm:px-3 text-xs"
            onClick={() => onViewModeChange?.('calendar')}
          >
            <CalendarIcon size={14} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="font-medium hidden sm:inline">{t('board.calendar')}</span>
          </Button>
        </div>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0">
          <button
            type="button"
            className="p-2 hover:bg-muted rounded-lg transition-colors md:hidden flex-shrink-0"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <Search size={16} className="text-muted-foreground" strokeWidth={1.5} />
          </button>

          <div className="hidden md:flex items-center bg-muted/30 border border-border rounded-lg px-3 py-1.5 w-44 lg:w-64 xl:w-72 h-8">
            <Search size={14} className="text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
            <Input
              placeholder={t('board.search')}
              className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs pl-2 px-0 h-6"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <span className="text-xs text-muted-foreground ml-auto flex-shrink-0 font-medium hidden xl:inline">
              &#x2318; F
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeFilter !== 'all' ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5 h-8 px-2 sm:px-3 text-xs flex-shrink-0"
              >
                <SlidersHorizontal size={14} strokeWidth={1.5} className="flex-shrink-0" />
                <span className="font-medium hidden sm:inline">
                  {activeFilter === 'all'
                    ? t('board.filter')
                    : t(FILTER_OPTIONS.find((o) => o.value === activeFilter)?.labelKey || 'board.filter')}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {FILTER_OPTIONS.map((option, index) => (
                <React.Fragment key={option.value}>
                  {index === 1 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => handleFilterChange(option.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{t(option.labelKey)}</span>
                    {activeFilter === option.value && (
                      <Check size={14} className="text-primary" strokeWidth={2.5} />
                    )}
                  </DropdownMenuItem>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 px-2 sm:px-3 text-xs bg-transparent flex-shrink-0 hidden sm:flex">
                <ArrowUpDown size={14} strokeWidth={1.5} className="flex-shrink-0" />
                <span className="font-medium hidden md:inline">{t('board.sort')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  onClick={() => handleSortChange(option.field)}
                  className="flex items-center justify-between"
                >
                  <span>{t(option.labelKey)}</span>
                  {activeSort?.field === option.field && (
                    <span className="flex items-center gap-1 text-primary">
                      <Check size={14} strokeWidth={2.5} />
                      <span className="text-[10px] font-semibold uppercase">
                        {activeSort.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden lg:flex -space-x-2 ml-1 flex-shrink-0">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                alt={`User ${i}`}
                className="w-7 h-7 rounded-full border-2 border-background hover:z-10 transition-transform hover:scale-110"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="px-3 sm:px-4 py-2 border-b border-border/50 md:hidden">
          <div className="flex items-center bg-muted/30 border border-border rounded-lg px-3 py-1.5 h-9">
            <Search size={14} className="text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
            <Input
              placeholder={t('board.search')}
              className="bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs pl-2 px-0 h-6"
              value={searchValue}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
