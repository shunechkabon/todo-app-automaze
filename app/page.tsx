"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  PriorityOrder,
  Task,
  TaskStatusFilter,
  TaskCategoryFilter,
} from "@/lib/types/task";
import { fetchTasks } from "@/lib/api/tasks";
import { TaskList } from "@/components/todo/TaskList";
import { TaskForm } from "@/components/todo/TaskForm";
import { TaskToolbar } from "@/components/todo/TaskToolbar";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [status, setStatus] = useState<TaskStatusFilter>("all");
  const [order, setOrder] = useState<PriorityOrder>("desc");
  const [category, setCategory] = useState<TaskCategoryFilter>("all");

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTasks({ q: debouncedQ, status, order, category });
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, status, order, category]);

  const updateTaskInState = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));

        next.sort((a, b) => {
          const p =
            order === "asc" ? a.priority - b.priority : b.priority - a.priority;
          if (p !== 0) return p;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        return next;
      });
    },
    [order]
  );

  const removeTaskFromState = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-200 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col gap-4 py-12 pr-32 pl-24 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between pl-8">
          <h1 className="text-2xl font-semibold">TODO</h1>
          <TaskForm onCreated={reload} />
        </div>

        <TaskToolbar
          q={q}
          onQChange={setQ}
          status={status}
          onStatusChange={setStatus}
          order={order}
          onOrderChange={setOrder}
          category={category}
          onCategoryChange={setCategory}
        />

        {loading && <p className="text-sm opacity-70">Loading…</p>}
        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onTaskUpdated={updateTaskInState}
            onTaskDeleted={removeTaskFromState}
          />
        )}
      </main>
    </div>
  );
}
