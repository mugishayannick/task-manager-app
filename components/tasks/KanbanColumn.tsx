'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Task, TaskStatus } from '@/types'
import { TaskCard } from './TaskCard'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  icon: React.ReactNode
  color: string
  tasks: Task[]
  count: number
  onTaskSelect?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  onCreateTask?: (status: TaskStatus) => void
  isDraggingOver?: boolean
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  icon,
  color,
  tasks,
  count,
  onTaskSelect,
  onTaskEdit,
  onTaskDelete,
  onCreateTask,
  isDraggingOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  return (
    <div
      className={`w-full md:w-80 lg:w-96 md:flex-shrink-0 flex flex-col bg-muted/20 rounded-lg transition-all ${
        isDraggingOver ? 'bg-muted/40 ring-2 ring-primary/30' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => onDrop?.(e, status)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Plus button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateTask?.(status)}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <Plus className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
          </Button>
          
          {/* Column title with status badge */}
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight">{title}</h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white ${color}`}>
              {count}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 space-y-2.5 md:min-h-96">
        <AnimatePresence mode="popLayout">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSelect={onTaskSelect}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-24 md:h-48 text-center text-muted-foreground">
              <p className="text-xs">No tasks</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
