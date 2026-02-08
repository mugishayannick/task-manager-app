/**
 * useTasks Hook
 * Custom hook for task management using React Query and Zustand
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTaskStore } from '@/store/taskStore'
import type { Task, FilterOptions, SortOptions } from '@/types'

interface MutationCallbacks {
  onSuccess?: () => void
  onError?: () => void
}

export const useTasks = () => {
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    sort,
    createTask: storeCreateTask,
    updateTask: storeUpdateTask,
    deleteTask: storeDeleteTask,
    setFilters,
    setSort,
    applyFiltersAndSort,
  } = useTaskStore()

  const queryClient = useQueryClient()

  const createTaskMutation = useMutation({
    mutationFn: (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
      storeCreateTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      storeUpdateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => storeDeleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const createTask = (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
    callbacks?: MutationCallbacks
  ) => {
    createTaskMutation.mutate(data, {
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError,
    })
  }

  const updateTask = (
    data: { id: string; updates: Partial<Task> },
    callbacks?: MutationCallbacks
  ) => {
    updateTaskMutation.mutate(data, {
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError,
    })
  }

  const deleteTask = (id: string, callbacks?: MutationCallbacks) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError,
    })
  }

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    sort,
    setFilters,
    setSort,
    applyFiltersAndSort,
    createTask,
    updateTask,
    deleteTask,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  }
}

export const useTaskById = (id: string) => {
  const { tasks } = useTaskStore()
  return tasks.find((task) => task.id === id)
}
