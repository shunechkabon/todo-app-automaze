export type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: number; // 1..10
  createdAt: string; // ISO
};

export type TaskStatusFilter = "all" | "done" | "undone";

export type PriorityOrder = "asc" | "desc";

export type TasksQuery = {
  q?: string;
  status?: TaskStatusFilter;
  order?: PriorityOrder;
};

export type CreateTaskDto = {
  title: string;
  priority?: number;
};

export type UpdateTaskDto = {
  title?: string;
  done?: boolean;
  priority?: number;
};
