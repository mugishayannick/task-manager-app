'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { KanbanBoard } from '@/components/tasks/KanbanBoard'
import { ListView } from '@/components/tasks/ListView'
import { DeleteConfirmDialog } from '@/components/tasks/DeleteConfirmDialog'
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog'
import { useTasks } from '@/hooks/useTasks'
import { useTasksInit } from '@/hooks/useTasksInit'
import { toast } from 'sonner'
import type { Task, TaskStatus, SortOptions } from '@/types'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban')

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  // Task form dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo')

  useTasksInit()

  const [activeFilter, setActiveFilter] = useState<'all' | TaskStatus>('all')

  const {
    filteredTasks,
    loading,
    error,
    sort,
    setFilters,
    setSort,
    deleteTask,
    createTask,
    updateTask,
    isDeleting,
    isCreating,
    isUpdating,
  } = useTasks()

  useEffect(() => {
    if (error) {
      toast.error(t('task.error'))
    }
  }, [error, t])

  const handleSearchChange = useCallback((value: string) => {
    setFilters({ search: value })
  }, [setFilters])

  const handleFilterChange = useCallback((filter: 'all' | TaskStatus) => {
    setActiveFilter(filter)
    if (filter === 'all') {
      setFilters({ status: undefined })
    } else {
      setFilters({ status: [filter] })
    }
  }, [setFilters])

  const handleSortChange = useCallback((newSort: SortOptions) => {
    setSort(newSort)
  }, [setSort])

  const handleTaskDelete = useCallback((taskId: string) => {
    const task = filteredTasks.find((t) => t.id === taskId)
    setTaskToDelete(task || null)
    setDeleteDialogOpen(true)
  }, [filteredTasks])

  const confirmDelete = useCallback(() => {
    if (!taskToDelete) return
    deleteTask(taskToDelete.id, {
      onSuccess: () => {
        toast.success(t('task.deleted'))
        setDeleteDialogOpen(false)
        setTaskToDelete(null)
      },
      onError: () => {
        toast.error(t('task.error'))
      },
    })
  }, [taskToDelete, deleteTask, t])

  const handleCreateTask = useCallback((status: TaskStatus) => {
    setTaskToEdit(null)
    setDefaultStatus(status)
    setFormDialogOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setTaskToEdit(task)
    setFormDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback((data: {
    title: string
    description?: string
    status: TaskStatus
    priority: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: string
  }) => {
    if (taskToEdit) {
      updateTask(
        { id: taskToEdit.id, updates: { ...data, description: data.description || '' } },
        {
          onSuccess: () => {
            toast.success(t('task.updated'))
            setFormDialogOpen(false)
            setTaskToEdit(null)
          },
          onError: () => {
            toast.error(t('task.error'))
          },
        }
      )
    } else {
      const newTask = {
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || new Date().toISOString().split('T')[0],
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      }
      createTask(newTask, {
        onSuccess: () => {
          toast.success(t('task.created'))
          setFormDialogOpen(false)
        },
        onError: () => {
          toast.error(t('task.error'))
        },
      })
    }
  }, [taskToEdit, updateTask, createTask, t])

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <Header
        title={t('board.title')}
        description={t('board.welcome')}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activeSort={sort}
        onSortChange={handleSortChange}
      />

      <div className="flex-1 overflow-auto bg-background">
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <KanbanBoard
                tasks={filteredTasks}
                loading={loading}
                error={error}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleEditTask}
                onCreateTask={handleCreateTask}
              />
            </motion.div>
          )}
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ListView
                tasks={filteredTasks}
                loading={loading}
                error={error}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleEditTask}
                onCreateTask={handleCreateTask}
              />
            </motion.div>
          )}
          {viewMode === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center h-full"
            >
              <p className="text-muted-foreground">{t('board.calendarSoon')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        taskTitle={taskToDelete?.title}
        isDeleting={isDeleting}
      />

      {/* Task Create/Edit Form Dialog */}
      <TaskFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleFormSubmit}
        task={taskToEdit}
        defaultStatus={defaultStatus}
        isSubmitting={isCreating || isUpdating}
      />
    </main>
  )
}
