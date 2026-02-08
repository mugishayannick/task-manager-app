'use client'

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Circle, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Task, TaskStatus } from '@/types'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  tasks: Task[]
  loading?: boolean
  error?: string | null
  onTaskSelect?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  onCreateTask?: (status: TaskStatus) => void
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  loading = false,
  error,
  onTaskSelect,
  onTaskEdit,
  onTaskDelete,
  onCreateTask,
}) => {
  const { t } = useTranslation()

  const columns: Array<{
    status: TaskStatus
    title: string
    icon: React.ReactNode
    color: string
    badgeColor: string
  }> = [
    {
      status: 'todo',
      title: t('status.todo'),
      icon: <Circle className="w-4 h-4" />,
      color: 'bg-red-500/10',
      badgeColor: 'bg-red-500',
    },
    {
      status: 'in_progress',
      title: t('status.in_progress'),
      icon: <Loader className="w-4 h-4 animate-spin" />,
      color: 'bg-blue-500/10',
      badgeColor: 'bg-blue-500',
    },
    {
      status: 'need_review',
      title: t('status.need_review'),
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-amber-500/10',
      badgeColor: 'bg-amber-500',
    },
    {
      status: 'done',
      title: t('status.done'),
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-emerald-500/10',
      badgeColor: 'bg-emerald-500',
    },
  ]

  const tasksByStatus = useMemo(() => {
    return columns.reduce(
      (acc, col) => {
        acc[col.status] = tasks.filter((task) => task.status === col.status)
        return acc
      },
      {} as Record<TaskStatus, Task[]>
    )
  }, [tasks, t])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96 text-destructive">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-4 md:pb-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-5 p-4 md:p-6 md:min-w-max">
        {columns.map((column, idx) => (
          <motion.div
            key={column.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
          >
            <KanbanColumn
              status={column.status}
              title={column.title}
              icon={column.icon}
              color={column.badgeColor}
              tasks={tasksByStatus[column.status]}
              count={tasksByStatus[column.status].length}
              onTaskSelect={onTaskSelect}
              onTaskEdit={onTaskEdit}
              onTaskDelete={onTaskDelete}
              onCreateTask={onCreateTask}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
