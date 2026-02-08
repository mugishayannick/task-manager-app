import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '../TaskCard'
import type { Task } from '@/types'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.edit': 'Edit',
        'task.delete': 'Delete',
        'task.checklist': 'Checklist',
      }
      return translations[key] || key
    },
  }),
}))

jest.mock('framer-motion', () => {
  const MotionDiv = React.forwardRef(
    ({ children, layout, initial, animate, exit, transition, whileHover, ...rest }: any, ref: any) => (
      <div ref={ref} {...rest}>{children}</div>
    )
  )
  MotionDiv.displayName = 'MotionDiv'

  return {
    motion: { div: MotionDiv },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task Title',
  description: 'Test task description text',
  status: 'todo',
  priority: 'high',
  dueDate: '2026-02-15',
  createdAt: '2026-02-05T00:00:00Z',
  updatedAt: '2026-02-05T00:00:00Z',
  assignees: [
    {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      email: 'john@example.com',
    },
  ],
  checklists: [
    {
      id: 'checklist-1',
      title: 'Subtasks',
      completed: 2,
      total: 4,
    },
  ],
  comments: [],
  attachments: 3,
  tags: ['important'],
}

describe('TaskCard', () => {
  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test Task Title')).toBeInTheDocument()
    expect(screen.getByText('Test task description text')).toBeInTheDocument()
  })

  it('renders formatted due date', () => {
    render(<TaskCard task={mockTask} />)
    const dateElement = screen.getByText(/Feb/)
    expect(dateElement).toBeInTheDocument()
  })

  it('renders checklist progress indicator', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('2/4')).toBeInTheDocument()
    expect(screen.getByText('Checklist')).toBeInTheDocument()
  })

  it('renders attachment count', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onSelect when card is clicked', () => {
    const onSelect = jest.fn()
    render(<TaskCard task={mockTask} onSelect={onSelect} />)

    const card = screen.getByText('Test Task Title').closest('[role="button"]')
    expect(card).not.toBeNull()
    fireEvent.click(card!)

    expect(onSelect).toHaveBeenCalledWith(mockTask)
  })

  it('handles keyboard navigation with Enter key', () => {
    const onSelect = jest.fn()
    render(<TaskCard task={mockTask} onSelect={onSelect} />)

    const card = screen.getByText('Test Task Title').closest('[role="button"]')
    expect(card).not.toBeNull()
    fireEvent.keyDown(card!, { key: 'Enter' })

    expect(onSelect).toHaveBeenCalledWith(mockTask)
  })

  it('renders assignee avatar', () => {
    render(<TaskCard task={mockTask} />)
    const avatar = screen.getByAltText('John Doe')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', expect.stringContaining('dicebear'))
  })

  it('shows +N badge when more than 3 assignees', () => {
    const taskWithManyAssignees: Task = {
      ...mockTask,
      assignees: [
        { id: 'u1', name: 'A', avatar: '', email: 'a@x.com' },
        { id: 'u2', name: 'B', avatar: '', email: 'b@x.com' },
        { id: 'u3', name: 'C', avatar: '', email: 'c@x.com' },
        { id: 'u4', name: 'D', avatar: '', email: 'd@x.com' },
      ],
    }

    render(<TaskCard task={taskWithManyAssignees} />)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('applies status dot color based on task status', () => {
    const { container } = render(<TaskCard task={mockTask} />)
    const statusDot = container.querySelector('.bg-slate-400')
    expect(statusDot).toBeInTheDocument()
  })

  it('does not render description when empty', () => {
    const taskNoDesc: Task = { ...mockTask, description: '' }
    render(<TaskCard task={taskNoDesc} />)
    expect(screen.queryByText('Test task description text')).not.toBeInTheDocument()
  })

  it('renders without crashing when no handlers provided', () => {
    const { container } = render(<TaskCard task={mockTask} />)
    expect(container.firstChild).toBeTruthy()
  })
})
