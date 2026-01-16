export type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: number; // 1..10
  createdAt: string; // ISO
  category?: "work" | "home" | "study" | "health" | "other";
};

export type TaskStatusFilter = "all" | "done" | "undone";

export type PriorityOrder = "asc" | "desc";

export type TaskCategory = "work" | "home" | "study" | "health" | "other";
export type TaskCategoryFilter = "all" | TaskCategory;

export type TasksQuery = {
  q?: string;
  status?: TaskStatusFilter;
  order?: PriorityOrder;
  category?: TaskCategoryFilter;
};

export type CreateTaskDto = {
  title: string;
  priority?: number;
  category?: "work" | "home" | "study" | "health" | "other";
};

export type UpdateTaskDto = {
  title?: string;
  done?: boolean;
  priority?: number;
  category?: "work" | "home" | "study" | "health" | "other";
};
