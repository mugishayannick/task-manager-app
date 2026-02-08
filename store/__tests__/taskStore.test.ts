import { useTaskStore } from '../taskStore'
import { taskService } from '@/lib/api/taskService'

jest.mock('@/lib/api/taskService', () => ({
  taskService: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    filterTasks: jest.fn((tasks) => tasks),
    sortTasks: jest.fn((tasks) => tasks),
  },
}))

const mockTasks = [
  {
    id: 'task-1',
    title: 'Task 1',
    description: '',
    status: 'todo' as const,
    priority: 'high' as const,
    dueDate: '2026-03-01',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    assignees: [],
    checklists: [],
    comments: [],
    attachments: 0,
    tags: [],
  },
  {
    id: 'task-2',
    title: 'Task 2',
    description: '',
    status: 'done' as const,
    priority: 'low' as const,
    dueDate: '2026-03-05',
    createdAt: '2026-02-02T00:00:00Z',
    updatedAt: '2026-02-02T00:00:00Z',
    assignees: [],
    checklists: [],
    comments: [],
    attachments: 0,
    tags: [],
  },
]

describe('TaskStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { getState } = useTaskStore
    getState().clearFilters()
    useTaskStore.setState({
      tasks: [],
      filteredTasks: [],
      loading: false,
      error: null,
      selectedTask: null,
    })
  })

  describe('fetchTasks', () => {
    it('fetches tasks and stores them', async () => {
      ;(taskService.getTasks as jest.Mock).mockResolvedValue(mockTasks)

      await useTaskStore.getState().fetchTasks()

      const state = useTaskStore.getState()
      expect(state.tasks).toEqual(mockTasks)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('sets loading to true during fetch', async () => {
      let resolvePromise: (value: any) => void
      ;(taskService.getTasks as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolvePromise = resolve
        })
      )

      const fetchPromise = useTaskStore.getState().fetchTasks()
      expect(useTaskStore.getState().loading).toBe(true)

      resolvePromise!(mockTasks)
      await fetchPromise

      expect(useTaskStore.getState().loading).toBe(false)
    })

    it('handles fetch error', async () => {
      ;(taskService.getTasks as jest.Mock).mockRejectedValue(
        new Error('Network error')
      )

      await useTaskStore.getState().fetchTasks()

      const state = useTaskStore.getState()
      expect(state.error).toBe('Network error')
      expect(state.loading).toBe(false)
    })
  })

  describe('createTask', () => {
    it('adds new task to the beginning of the list', async () => {
      const newTask = {
        ...mockTasks[0],
        id: 'task-new',
        title: 'New Task',
      }
      ;(taskService.createTask as jest.Mock).mockResolvedValue(newTask)

      useTaskStore.setState({ tasks: mockTasks })

      await useTaskStore.getState().createTask({
        title: 'New Task',
        description: '',
        status: 'todo',
        priority: 'high',
        dueDate: '2026-03-01',
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      })

      const state = useTaskStore.getState()
      expect(state.tasks[0].title).toBe('New Task')
      expect(state.tasks).toHaveLength(3)
    })
  })

  describe('deleteTask', () => {
    it('removes task from the list', async () => {
      ;(taskService.deleteTask as jest.Mock).mockResolvedValue(undefined)

      useTaskStore.setState({ tasks: mockTasks })

      await useTaskStore.getState().deleteTask('task-1')

      const state = useTaskStore.getState()
      expect(state.tasks).toHaveLength(1)
      expect(state.tasks[0].id).toBe('task-2')
    })

    it('clears selected task if deleted task was selected', async () => {
      ;(taskService.deleteTask as jest.Mock).mockResolvedValue(undefined)

      useTaskStore.setState({
        tasks: mockTasks,
        selectedTask: mockTasks[0],
      })

      await useTaskStore.getState().deleteTask('task-1')

      expect(useTaskStore.getState().selectedTask).toBeNull()
    })
  })

  describe('setFilters', () => {
    it('merges new filters with existing ones', () => {
      useTaskStore.getState().setFilters({ search: 'test' })
      expect(useTaskStore.getState().filters.search).toBe('test')

      useTaskStore.getState().setFilters({ status: ['todo'] })
      const state = useTaskStore.getState()
      expect(state.filters.search).toBe('test')
      expect(state.filters.status).toEqual(['todo'])
    })
  })

  describe('clearFilters', () => {
    it('resets filters and sort to initial values', () => {
      useTaskStore.getState().setFilters({ search: 'test', status: ['todo'] })
      useTaskStore.getState().clearFilters()

      const state = useTaskStore.getState()
      expect(state.filters).toEqual({})
      expect(state.sort).toEqual({ field: 'dueDate', direction: 'asc' })
    })
  })

  describe('setSelectedTask', () => {
    it('sets and clears selected task', () => {
      useTaskStore.getState().setSelectedTask(mockTasks[0])
      expect(useTaskStore.getState().selectedTask).toEqual(mockTasks[0])

      useTaskStore.getState().setSelectedTask(null)
      expect(useTaskStore.getState().selectedTask).toBeNull()
    })
  })

  describe('selectTaskById', () => {
    it('selects task by ID', () => {
      useTaskStore.setState({ tasks: mockTasks })
      useTaskStore.getState().selectTaskById('task-2')

      expect(useTaskStore.getState().selectedTask?.id).toBe('task-2')
    })

    it('sets null when task not found', () => {
      useTaskStore.setState({ tasks: mockTasks })
      useTaskStore.getState().selectTaskById('nonexistent')

      expect(useTaskStore.getState().selectedTask).toBeNull()
    })
  })
})
