import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, isToday, isTomorrow, isThisWeek } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return 'Today'
  }
  if (isTomorrow(dateObj)) {
    return 'Tomorrow'
  }
  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE')
  }

  const daysUntil = differenceInDays(dateObj, new Date())
  if (daysUntil > 0 && daysUntil <= 30) {
    return format(dateObj, 'MMM d')
  }

  return format(dateObj, 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM d, yyyy HH:mm')
}

export function getPriorityLabel(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    urgent: 'Urgent',
  }
  return priorityMap[priority] || priority
}

export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    todo: 'To-do',
    in_progress: 'In Progress',
    need_review: 'Need Review',
    done: 'Done',
  }
  return statusMap[status] || status
}
