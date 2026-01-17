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
    <div className="min-h-dvh bg-zinc-200 font-sans dark:bg-black">
      <main className="mx-auto w-[375px] bg-white dark:bg-black px-4 py-8 md:w-[730px] md:pr-10 md:pl-6 md:py-10 xl:w-[1000px] xl:pr-32 xl:pl-24 xl:py-12">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:pl-7 xl:pl-8">
          <h1 className="text-2xl font-semibold">TODO</h1>
          <TaskForm onCreated={reload} />
        </div>

        <div className="mt-4 md:mt-6">
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
        </div>

        <div className="mt-4 md:mt-6">
          {loading && <p className="text-sm opacity-70">Loading…</p>}
          {error && <p className="text-sm text-red-600">Error: {error}</p>}

          {!loading && !error && (
            <TaskList
              tasks={tasks}
              onTaskUpdated={updateTaskInState}
              onTaskDeleted={removeTaskFromState}
            />
          )}
        </div>
      </main>
    </div>
  );
}
