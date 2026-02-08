/**
 * Application constants
 * Centralized configuration for the entire application
 */

import type { TaskStatus, TaskPriority } from "@/types";

export const TASK_STATUSES: {
  value: TaskStatus;
  label: string;
  icon: string;
}[] = [
  { value: "todo", label: "To-do", icon: "circle" },
  { value: "in_progress", label: "On Progress", icon: "loader" },
  { value: "need_review", label: "Need Review", icon: "alert-circle" },
  { value: "done", label: "Done", icon: "check-circle" },
];

export const TASK_PRIORITIES: {
  value: TaskPriority;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Low", color: "text-blue-500" },
  { value: "medium", label: "Medium", color: "text-yellow-500" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "urgent", label: "Urgent", color: "text-red-500" },
];

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";

export const PAGINATION_LIMITS = {
  TASKS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 10,
  SEARCH_RESULTS: 50,
};

export const DEBOUNCE_DELAY = 300;
export const CACHE_TIME = 1000 * 60 * 5; // 5 minutes
export const STALE_TIME = 1000 * 60 * 2; // 2 minutes

export const SIDEBAR_ITEMS = [
  { id: "search", label: "Search", icon: "search" },
  { id: "ai", label: "Kla AI", icon: "zap" },
  { id: "inbox", label: "Inbox", icon: "mail" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "settings", label: "Settings & Preferences", icon: "settings" },
];

export const THEME_CONFIG = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const SUPPORTED_LANGUAGES = {
  EN: "en",
  FR: "fr",
};

export const DEFAULT_LANGUAGE = "en";
