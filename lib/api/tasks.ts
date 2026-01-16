import type {
  CreateTaskDto,
  Task,
  TasksQuery,
  UpdateTaskDto,
} from "../types/task";

function buildQuery(params: TasksQuery) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.status && params.status !== "all") sp.set("status", params.status);
  if (params.order) sp.set("order", params.order);
  if (params.category && params.category !== "all")
    sp.set("category", params.category);
  return sp.toString();
}

async function readError(res: Response) {
  const data = await res.json().catch(() => null);
  return data?.message || `Request failed: ${res.status}`;
}

export async function fetchTasks(params: TasksQuery = {}): Promise<Task[]> {
  const qs = buildQuery(params);
  const res = await fetch(`/api/tasks${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function addTask(dto: CreateTaskDto): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function patchTask(id: string, dto: UpdateTaskDto): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function removeTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res));
}
