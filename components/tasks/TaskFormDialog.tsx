'use client'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['todo', 'in_progress', 'need_review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskFormValues) => void
  task?: Task | null
  defaultStatus?: TaskStatus
  isSubmitting?: boolean
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  task,
  defaultStatus = 'todo',
  isSubmitting = false,
}) => {
  const { t } = useTranslation()
  const isEditing = !!task

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate?.split('T')[0],
      })
    } else {
      reset({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [task, defaultStatus, reset])

  const statusValue = watch('status')
  const priorityValue = watch('priority')

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('task.edit') : t('task.create')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('task.title')}</Label>
            <Input
              id="title"
              placeholder={t('task.titlePlaceholder')}
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('task.description')}</Label>
            <textarea
              id="description"
              placeholder={t('task.descriptionPlaceholder')}
              {...register('description')}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('board.statusCol')}</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue('status', val as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('task.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{t('status.todo')}</SelectItem>
                  <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                  <SelectItem value="need_review">{t('status.need_review')}</SelectItem>
                  <SelectItem value="done">{t('status.done')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('sort.priority')}</Label>
              <Select
                value={priorityValue}
                onValueChange={(val) => setValue('priority', val as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('task.selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('priority.low')}</SelectItem>
                  <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                  <SelectItem value="high">{t('priority.high')}</SelectItem>
                  <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">{t('task.dueDate')}</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? t('task.saving') : t('task.creating')}
                </span>
              ) : (
                isEditing ? t('common.save') : t('task.create')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
