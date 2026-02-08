/**
 * Task Service
 * Business logic for task operations
 * Uses DummyJSON API as data source with English task titles
 */

import type { Task, FilterOptions, SortOptions } from "@/types";
import { apiClient } from "./client";

interface DummyJsonTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface DummyJsonTodosResponse {
  todos: DummyJsonTodo[];
  total: number;
  skip: number;
  limit: number;
}

class TaskService {
  private baseUrl = "/todos";

  /**
   * Fetch all tasks
   * Maps DummyJSON todos to our Task type
   */
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<DummyJsonTodosResponse>(
      `${this.baseUrl}?limit=50`
    );
    return this.mapTodosToTasks(response.data.todos);
  }

  /**
   * Fetch single task
   */
  async getTask(id: string | number): Promise<Task> {
    const response = await apiClient.get<DummyJsonTodo>(
      `${this.baseUrl}/${id}`
    );
    return this.mapTodoToTask(response.data, response.data.id);
  }

  /**
   * Create new task
   */
  async createTask(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const response = await apiClient.post<DummyJsonTodo>(
      `${this.baseUrl}/add`,
      {
        todo: task.title,
        completed: false,
        userId: 1,
      }
    );
    return this.mapTodoToTask(response.data, response.data.id);
  }

  /**
   * Update task
   */
  async updateTask(id: string | number, updates: Partial<Task>): Promise<Task> {
    const numericId = typeof id === "string" ? id.replace("task-", "") : id;
    const response = await apiClient.put<DummyJsonTodo>(
      `${this.baseUrl}/${numericId}`,
      {
        todo: updates.title,
        completed: updates.status === "done",
      }
    );
    return this.mapTodoToTask(response.data, Number(numericId));
  }

  /**
   * Delete task
   */
  async deleteTask(id: string | number): Promise<void> {
    const numericId = typeof id === "string" ? id.replace("task-", "") : id;
    await apiClient.delete(`${this.baseUrl}/${numericId}`);
  }

  /**
   * Filter tasks
   */
  filterTasks(tasks: Task[], filters: FilterOptions): Task[] {
    return tasks.filter((task) => {
      if (filters.status && !filters.status.includes(task.status)) {
        return false;
      }
      if (filters.priority && !filters.priority.includes(task.priority)) {
        return false;
      }
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }

  /**
   * Sort tasks
   */
  sortTasks(tasks: Task[], options: SortOptions): Task[] {
    const sorted = [...tasks].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (options.field) {
        case "dueDate":
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "priority": {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        }
      }

      return options.direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }

  /**
   * Map DummyJSON todo to Task
   */
  private mapTodoToTask(todo: DummyJsonTodo, index: number): Task {
    const statuses = ["todo", "in_progress", "need_review", "done"] as const;
    const priorities = ["low", "medium", "high", "urgent"] as const;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));

    const statusIndex = todo.completed ? 3 : index % 3;

    return {
      id: `task-${todo.id || index}`,
      title: todo.todo || `Task ${index}`,
      description: `Task description for ${todo.todo || `Task ${index}`}`,
      status: statuses[statusIndex],
      priority: priorities[index % 4],
      dueDate: dueDate.toISOString().split("T")[0],
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
      assignees: [
        {
          id: `user-${(index % 5) + 1}`,
          name: `Team Member ${(index % 5) + 1}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${index}`,
          email: `user${index}@example.com`,
        },
      ],
      checklists: [
        {
          id: `checklist-${index}`,
          title: "Subtasks",
          completed: Math.floor(Math.random() * 4),
          total: 4,
        },
      ],
      comments: [],
      attachments: Math.floor(Math.random() * 3),
      tags: ["important", "review"].slice(0, (index % 2) + 1),
    };
  }

  /**
   * Map multiple todos to Tasks
   */
  private mapTodosToTasks(todos: DummyJsonTodo[]): Task[] {
    return todos
      .slice(0, 50)
      .map((todo, index) => this.mapTodoToTask(todo, index + 1));
  }
}

export const taskService = new TaskService();
