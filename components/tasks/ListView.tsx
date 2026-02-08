'use client'

import React from 'react'
import { Task, TaskStatus } from '@/types'
import {
  ChevronDown,
  Calendar,
  Radio,
  Paperclip,
  Users,
  MoreVertical,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ListViewProps {
  tasks: Task[]
  loading?: boolean
  error?: string | null
  onTaskSelect?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  onCreateTask?: (status: TaskStatus) => void
}

const statusConfigs: Record<TaskStatus, { label: string; badge: string; color: string }> = {
  todo: { label: 'To-do', badge: 'red', color: 'text-red-600 bg-red-50' },
  in_progress: { label: 'On Progress', badge: 'blue', color: 'text-blue-600 bg-blue-50' },
  need_review: { label: 'Need Review', badge: 'yellow', color: 'text-yellow-600 bg-yellow-50' },
  done: { label: 'Done', badge: 'green', color: 'text-green-600 bg-green-50' },
}

const getPriorityBadge = (priority?: string) => {
  const priorityMap: Record<string, { label: string; color: string }> = {
    high: { label: 'High', color: 'bg-red-100 text-red-600' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-600' },
    low: { label: 'Low', color: 'bg-blue-100 text-blue-600' },
  }
  return priorityMap[priority || 'medium'] || priorityMap['medium']
}

/** Desktop table row for a single task */
const TaskRow: React.FC<{
  task: Task
  idx: number
  onTaskSelect?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
}> = ({ task, idx, onTaskSelect, onTaskEdit, onTaskDelete }) => (
  <div
    className={`flex items-center px-6 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'
      }`}
    onClick={() => onTaskSelect?.(task)}
  >
    {/* Checkbox */}
    <div className="w-12 flex items-center justify-center flex-shrink-0">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-border cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
    </div>

    {/* Task Name */}
    <div className="flex-1 min-w-[200px]">
      <p className="text-sm font-semibold text-foreground truncate hover:text-primary">
        {task.title}
      </p>
    </div>

    {/* Date Range */}
    <div className="w-48 flex-shrink-0">
      <p className="text-xs text-muted-foreground">
        {task.dueDate ? task.dueDate.split('T')[0] : 'No date'} - {task.dueDate ? task.dueDate.split('T')[0] : 'No date'}
      </p>
    </div>

    {/* Status Priority */}
    <div className="w-32 flex-shrink-0">
      <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${getPriorityBadge(task.priority).color}`}>
        {getPriorityBadge(task.priority).label}
      </span>
    </div>

    {/* Attachment */}
    <div className="w-40 flex items-center gap-2 flex-shrink-0">
      {task.attachments > 0 ? (
        <>
          <Paperclip size={14} className="text-muted-foreground" strokeWidth={1.5} />
          <span className="text-xs text-muted-foreground truncate">
            document_{task.id}.pdf
          </span>
          {task.attachments > 1 && (
            <span className="text-xs text-muted-foreground">+{task.attachments - 1}</span>
          )}
        </>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      )}
    </div>

    {/* People/Assignees */}
    <div className="w-40 flex items-center flex-shrink-0">
      {task.assignees.length > 0 ? (
        <div className="flex -space-x-1.5">
          {task.assignees.slice(0, 3).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatar || '/placeholder.svg'}
              alt={assignee.name}
              className="w-6 h-6 rounded-full border-2 border-background hover:z-10"
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      )}
    </div>

    {/* Actions Menu */}
    <div className="w-12 flex items-center justify-center flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} className="text-muted-foreground" strokeWidth={2} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onTaskEdit?.(task)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => onTaskDelete?.(task.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
)

/** Mobile card view for a single task */
const TaskMobileCard: React.FC<{
  task: Task
  onTaskSelect?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
}> = ({ task, onTaskSelect, onTaskEdit, onTaskDelete }) => (
  <div
    className="p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
    onClick={() => onTaskSelect?.(task)}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{task.title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {task.dueDate ? task.dueDate.split('T')[0] : 'No date'}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadge(task.priority).color}`}>
          {getPriorityBadge(task.priority).label}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={16} className="text-muted-foreground" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onTaskEdit?.(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onTaskDelete?.(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className="flex items-center gap-3 mt-2.5">
      {task.attachments > 0 && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Paperclip size={12} strokeWidth={1.5} />
          <span className="text-xs">{task.attachments}</span>
        </div>
      )}
      {task.assignees.length > 0 && (
        <div className="flex -space-x-1.5">
          {task.assignees.slice(0, 3).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatar || '/placeholder.svg'}
              alt={assignee.name}
              className="w-5 h-5 rounded-full border-2 border-background"
              title={assignee.name}
            />
          ))}
          {task.assignees.length > 3 && (
            <div className="w-5 h-5 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)

interface StatusGroupProps {
  status: TaskStatus
  tasks: Task[]
  onTaskSelect?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: string) => void
  onCreateTask?: (status: TaskStatus) => void
}

const StatusGroup: React.FC<StatusGroupProps> = ({
  status,
  tasks,
  onTaskSelect,
  onTaskEdit,
  onTaskDelete,
  onCreateTask,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const config = statusConfigs[status]

  if (tasks.length === 0) return null

  return (
    <div className="mb-4 md:mb-6">
      {/* Group Header */}
      <div className="flex items-center gap-2 px-4 md:px-6 py-3 bg-background border-b border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:bg-muted rounded px-2 py-1 transition-colors"
        >
          <Plus size={18} className="text-muted-foreground" strokeWidth={2} />
          <span className="text-sm font-semibold text-foreground">{config.label}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${status === 'todo' ? 'bg-red-500' :
              status === 'in_progress' ? 'bg-blue-500' :
                status === 'need_review' ? 'bg-yellow-500' :
                  'bg-green-500'
            }`}>
            {tasks.length}
          </span>
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto p-1 hover:bg-muted rounded transition-colors"
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Desktop Column Headers */}
          <div className="hidden md:flex items-center px-6 py-3 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground">
            <div className="w-12 flex items-center justify-center flex-shrink-0">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border"
                readOnly
              />
            </div>
            <div className="flex-1 min-w-[200px] flex items-center gap-2">
              <span>Aa</span>
              <span>Name</span>
            </div>
            <div className="w-48 flex items-center gap-2 flex-shrink-0">
              <Calendar size={16} />
              <span>Dates</span>
            </div>
            <div className="w-32 flex items-center gap-2 flex-shrink-0">
              <Radio size={16} />
              <span>Status</span>
            </div>
            <div className="w-40 flex items-center gap-2 flex-shrink-0">
              <Paperclip size={16} />
              <span>Attachment</span>
            </div>
            <div className="w-40 flex items-center gap-2 flex-shrink-0">
              <Users size={16} />
              <span>People</span>
            </div>
            <div className="w-12 flex items-center justify-center flex-shrink-0">
              <MoreVertical size={16} />
            </div>
          </div>

          {/* Desktop Task Rows */}
          <div className="hidden md:block">
            {tasks.map((task, idx) => (
              <TaskRow
                key={task.id}
                task={task}
                idx={idx}
                onTaskSelect={onTaskSelect}
                onTaskEdit={onTaskEdit}
                onTaskDelete={onTaskDelete}
              />
            ))}
          </div>

          {/* Mobile Task Cards */}
          <div className="md:hidden">
            {tasks.map((task) => (
              <TaskMobileCard
                key={task.id}
                task={task}
                onTaskSelect={onTaskSelect}
                onTaskEdit={onTaskEdit}
                onTaskDelete={onTaskDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  loading,
  error,
  onTaskSelect,
  onTaskEdit,
  onTaskDelete,
  onCreateTask,
}) => {
  // Group tasks by status
  const groupedTasks = React.useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      need_review: [],
      done: [],
    }

    tasks.forEach((task) => {
      groups[task.status].push(task)
    })

    return groups
  }, [tasks])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 md:h-96">
        <p className="text-destructive">Error loading tasks</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Status Groups */}
      <div className="divide-y divide-border">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <StatusGroup
            key={status}
            status={status as TaskStatus}
            tasks={statusTasks}
            onTaskSelect={onTaskSelect}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onCreateTask={onCreateTask}
          />
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex items-center justify-center h-64 md:h-96">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      )}
    </div>
  )
}
