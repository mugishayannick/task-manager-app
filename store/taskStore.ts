/**
 * Task Store
 * Global state management using Zustand
 * Follows Single Responsibility Principle
 */

import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { Task, FilterOptions, SortOptions } from '@/types'
import { taskService } from '@/lib/api/taskService'

interface TaskState {
  // State
  tasks: Task[]
  loading: boolean
  error: string | null
  filteredTasks: Task[]
  selectedTask: Task | null
  filters: FilterOptions
  sort: SortOptions

  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setFilters: (filters: Partial<FilterOptions>) => void
  setSort: (sort: SortOptions) => void
  setSelectedTask: (task: Task | null) => void
  selectTaskById: (id: string) => void
  applyFiltersAndSort: () => void
  clearFilters: () => void
}

const initialSort: SortOptions = {
  field: 'dueDate',
  direction: 'asc',
}

const initialFilters: FilterOptions = {}

export const useTaskStore = create<TaskState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      tasks: [],
      loading: false,
      error: null,
      filteredTasks: [],
      selectedTask: null,
      filters: initialFilters,
      sort: initialSort,

      // Actions
      fetchTasks: async () => {
        try {
          set({ loading: true, error: null })
          const tasks = await taskService.getTasks()
          set({ tasks })
          get().applyFiltersAndSort()
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tasks'
          set({ error: message })
        } finally {
          set({ loading: false })
        }
      },

      createTask: async (newTask) => {
        try {
          set({ error: null })
          const task = await taskService.createTask(newTask)
          set((state) => ({
            tasks: [task, ...state.tasks],
          }))
          get().applyFiltersAndSort()
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create task'
          set({ error: message })
        }
      },

      updateTask: async (id, updates) => {
        try {
          set({ error: null })
          const updatedTask = await taskService.updateTask(id, updates)
          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
          }))
          get().applyFiltersAndSort()
          if (get().selectedTask?.id === id) {
            set({ selectedTask: updatedTask })
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update task'
          set({ error: message })
        }
      },

      deleteTask: async (id) => {
        try {
          set({ error: null })
          await taskService.deleteTask(id)
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }))
          if (get().selectedTask?.id === id) {
            set({ selectedTask: null })
          }
          get().applyFiltersAndSort()
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete task'
          set({ error: message })
        }
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }))
        get().applyFiltersAndSort()
      },

      setSort: (newSort) => {
        set({ sort: newSort })
        get().applyFiltersAndSort()
      },

      setSelectedTask: (task) => {
        set({ selectedTask: task })
      },

      selectTaskById: (id) => {
        const task = get().tasks.find((t) => t.id === id)
        set({ selectedTask: task || null })
      },

      applyFiltersAndSort: () => {
        const { tasks, filters, sort } = get()
        let filtered = taskService.filterTasks(tasks, filters)
        filtered = taskService.sortTasks(filtered, sort)
        set({ filteredTasks: filtered })
      },

      clearFilters: () => {
        set({ filters: initialFilters, sort: initialSort })
        get().applyFiltersAndSort()
      },
    })),
    { name: 'TaskStore' }
  )
)

// Selectors for optimization
export const useTasksSelector = (state: TaskState) => state.tasks
export const useFilteredTasksSelector = (state: TaskState) => state.filteredTasks
export const useLoadingSelector = (state: TaskState) => state.loading
export const useErrorSelector = (state: TaskState) => state.error
export const useSelectedTaskSelector = (state: TaskState) => state.selectedTask
