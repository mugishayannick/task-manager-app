import { taskService } from "../taskService";
import type { Task, FilterOptions, SortOptions } from "@/types";

// Mock the API client
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const { apiClient } = require("../client");

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("fetches and maps todos to tasks", async () => {
      apiClient.get.mockResolvedValue({
        data: {
          todos: [
            { id: 1, todo: "Buy groceries", completed: false, userId: 1 },
            { id: 2, todo: "Walk the dog", completed: true, userId: 1 },
          ],
          total: 2,
          skip: 0,
          limit: 50,
        },
      });

      const tasks = await taskService.getTasks();

      expect(apiClient.get).toHaveBeenCalledWith("/todos?limit=50");
      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe("Buy groceries");
      expect(tasks[0].id).toContain("task-");
      expect(tasks[1].status).toBe("done");
    });

    it("maps completed todos to done status", async () => {
      apiClient.get.mockResolvedValue({
        data: {
          todos: [
            { id: 1, todo: "Completed task", completed: true, userId: 1 },
          ],
          total: 1,
          skip: 0,
          limit: 50,
        },
      });

      const tasks = await taskService.getTasks();
      expect(tasks[0].status).toBe("done");
    });
  });

  describe("createTask", () => {
    it("creates a task via API and returns mapped task", async () => {
      apiClient.post.mockResolvedValue({
        data: { id: 999, todo: "New task", completed: false, userId: 1 },
      });

      const task = await taskService.createTask({
        title: "New task",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "2026-03-01",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      });

      expect(apiClient.post).toHaveBeenCalledWith("/todos/add", {
        todo: "New task",
        completed: false,
        userId: 1,
      });
      expect(task.title).toBe("New task");
    });
  });

  describe("deleteTask", () => {
    it("calls delete endpoint with correct ID", async () => {
      apiClient.delete.mockResolvedValue({ data: {} });

      await taskService.deleteTask("task-5");

      expect(apiClient.delete).toHaveBeenCalledWith("/todos/5");
    });

    it("handles numeric IDs", async () => {
      apiClient.delete.mockResolvedValue({ data: {} });

      await taskService.deleteTask(5);

      expect(apiClient.delete).toHaveBeenCalledWith("/todos/5");
    });
  });

  describe("filterTasks", () => {
    const tasks: Task[] = [
      {
        id: "task-1",
        title: "Design UI",
        description: "",
        status: "todo",
        priority: "high",
        dueDate: "2026-03-01",
        createdAt: "2026-02-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      },
      {
        id: "task-2",
        title: "Write tests",
        description: "",
        status: "in_progress",
        priority: "medium",
        dueDate: "2026-03-05",
        createdAt: "2026-02-02T00:00:00Z",
        updatedAt: "2026-02-02T00:00:00Z",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      },
      {
        id: "task-3",
        title: "Deploy app",
        description: "",
        status: "done",
        priority: "low",
        dueDate: "2026-03-10",
        createdAt: "2026-02-03T00:00:00Z",
        updatedAt: "2026-02-03T00:00:00Z",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      },
    ];

    it("returns all tasks when no filters applied", () => {
      const result = taskService.filterTasks(tasks, {});
      expect(result).toHaveLength(3);
    });

    it("filters by status", () => {
      const filters: FilterOptions = { status: ["todo"] };
      const result = taskService.filterTasks(tasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Design UI");
    });

    it("filters by multiple statuses", () => {
      const filters: FilterOptions = { status: ["todo", "done"] };
      const result = taskService.filterTasks(tasks, filters);
      expect(result).toHaveLength(2);
    });

    it("filters by priority", () => {
      const filters: FilterOptions = { priority: ["high"] };
      const result = taskService.filterTasks(tasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Design UI");
    });

    it("filters by search term (case-insensitive)", () => {
      const filters: FilterOptions = { search: "deploy" };
      const result = taskService.filterTasks(tasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Deploy app");
    });

    it("returns empty array when no matches", () => {
      const filters: FilterOptions = { search: "nonexistent" };
      const result = taskService.filterTasks(tasks, filters);
      expect(result).toHaveLength(0);
    });
  });

  describe("sortTasks", () => {
    const tasks: Task[] = [
      {
        id: "task-1",
        title: "A",
        description: "",
        status: "todo",
        priority: "low",
        dueDate: "2026-03-10",
        createdAt: "2026-02-03T00:00:00Z",
        updatedAt: "2026-02-03T00:00:00Z",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      },
      {
        id: "task-2",
        title: "B",
        description: "",
        status: "in_progress",
        priority: "urgent",
        dueDate: "2026-03-01",
        createdAt: "2026-02-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      },
      {
        id: "task-3",
        title: "C",
        description: "",
        status: "done",
        priority: "high",
        dueDate: "2026-03-05",
        createdAt: "2026-02-02T00:00:00Z",
        updatedAt: "2026-02-02T00:00:00Z",
        assignees: [],
        checklists: [],
        comments: [],
        attachments: 0,
        tags: [],
      },
    ];

    it("sorts by due date ascending", () => {
      const options: SortOptions = { field: "dueDate", direction: "asc" };
      const result = taskService.sortTasks(tasks, options);
      expect(result[0].title).toBe("B");
      expect(result[2].title).toBe("A");
    });

    it("sorts by due date descending", () => {
      const options: SortOptions = { field: "dueDate", direction: "desc" };
      const result = taskService.sortTasks(tasks, options);
      expect(result[0].title).toBe("A");
      expect(result[2].title).toBe("B");
    });

    it("sorts by priority ascending (urgent first)", () => {
      const options: SortOptions = { field: "priority", direction: "asc" };
      const result = taskService.sortTasks(tasks, options);
      expect(result[0].priority).toBe("urgent");
      expect(result[2].priority).toBe("low");
    });

    it("sorts by created date ascending", () => {
      const options: SortOptions = { field: "createdAt", direction: "asc" };
      const result = taskService.sortTasks(tasks, options);
      expect(result[0].title).toBe("B");
      expect(result[2].title).toBe("A");
    });

    it("does not mutate original array", () => {
      const original = [...tasks];
      const options: SortOptions = { field: "dueDate", direction: "desc" };
      taskService.sortTasks(tasks, options);
      expect(tasks).toEqual(original);
    });
  });
});
