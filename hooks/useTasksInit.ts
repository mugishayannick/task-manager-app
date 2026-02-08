'use client';

/**
 * useTasksInit Hook
 * Initializes tasks on component mount
 */

import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'

export const useTasksInit = () => {
  const { tasks, fetchTasks, loading } = useTaskStore()

  useEffect(() => {
    if (tasks.length === 0 && !loading) {
      fetchTasks()
    }
  }, [])

  return { tasks, loading }
}
