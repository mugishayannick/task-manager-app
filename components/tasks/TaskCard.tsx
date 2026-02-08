'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, MessageCircle, Paperclip, CheckCircle2, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Task } from '@/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onSelect?: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  isDragging?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onSelect,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  const { t } = useTranslation()
  const priorityColors = {
    low: 'text-blue-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  }

  const statusDotColor = {
    todo: 'bg-slate-400',
    in_progress: 'bg-blue-500',
    need_review: 'bg-yellow-500',
    done: 'bg-green-500',
  }

  const progressPercentage = task.checklists[0]
    ? Math.round((task.checklists[0].completed / task.checklists[0].total) * 100)
    : 0

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(task)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(task)
        }
      }}
      className={`group rounded-lg border border-border bg-card p-3 cursor-pointer transition-all hover:shadow-md hover:border-border outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isDragging ? 'shadow-lg opacity-50' : ''}`}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Date and Menu */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-slate-400 rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              {formatDate(task.dueDate)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity p-0 hover:bg-transparent"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(task.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 leading-tight mb-1">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
            {task.description}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-border/40 my-2" />

        {/* Checklist Progress */}
        {task.checklists.length > 0 && (
          <div className="mb-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs font-medium text-foreground">Checklist</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {task.checklists[0].completed}/{task.checklists[0].total}
              </span>
            </div>
            {/* Progress Bars - Individual bars instead of continuous */}
            <div className="flex gap-1">
              {Array.from({ length: task.checklists[0].total }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded ${index < task.checklists[0].completed ? 'bg-green-500' : 'bg-muted'
                    }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border/40 my-2" />

        {/* Metadata Section - Footer */}
        <div className="flex items-center gap-2">
          {/* Attachments Badge */}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded flex-shrink-0">
              <Paperclip size={14} className="text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs font-medium text-muted-foreground">{task.attachments}</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Assignees Avatars */}
          {task.assignees.length > 0 && (
            <div className="flex -space-x-2 flex-shrink-0">
              {task.assignees.slice(0, 3).map((assignee) => (
                <img
                  key={assignee.id}
                  src={assignee.avatar || '/placeholder.svg'}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full border-2 border-card hover:z-20 transition-all hover:scale-110"
                  title={assignee.name}
                />
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground hover:z-20">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
