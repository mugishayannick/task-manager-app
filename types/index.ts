/**
 * Core types for the Task Manager application
 * Following separation of concerns and SOLID principles
 */

export type TaskStatus = 'todo' | 'in_progress' | 'need_review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Checklist {
  id: string
  title: string
  completed: number
  total: number
}

export interface TaskAssignee {
  id: string
  name: string
  avatar: string
  email: string
}

export interface TaskComment {
  id: string
  author: TaskAssignee
  content: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  updatedAt: string
  assignees: TaskAssignee[]
  checklists: Checklist[]
  comments: TaskComment[]
  attachments: number
  tags: string[]
}

export interface TaskBoard {
  id: string
  title: string
  description: string
  tasks: Task[]
}

export interface FilterOptions {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assignee?: string
  search?: string
}

export interface SortOptions {
  field: 'dueDate' | 'createdAt' | 'priority'
  direction: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
