import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeleteConfirmDialog } from '../DeleteConfirmDialog'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'task.deleteTitle': 'Delete Task?',
        'task.deleteDescription': 'This action cannot be undone.',
        'task.deleteConfirm': 'Yes, Delete',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
      }
      return translations[key] || key
    },
  }),
}))

describe('DeleteConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onConfirm: jest.fn(),
    taskTitle: 'My Test Task',
    isDeleting: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dialog title and description when open', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Delete Task?')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  it('displays the task title in the dialog', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByText(/My Test Task/)).toBeInTheDocument()
  })

  it('renders cancel and confirm buttons', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
  })

  it('calls onConfirm when delete button is clicked', () => {
    render(<DeleteConfirmDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Yes, Delete'))
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when isDeleting is true', () => {
    render(<DeleteConfirmDialog {...defaultProps} isDeleting={true} />)
    const cancelButton = screen.getByText('Cancel')
    expect(cancelButton.closest('button')).toBeDisabled()
  })

  it('does not render when open is false', () => {
    render(<DeleteConfirmDialog {...defaultProps} open={false} />)
    expect(screen.queryByText('Delete Task?')).not.toBeInTheDocument()
  })
})
