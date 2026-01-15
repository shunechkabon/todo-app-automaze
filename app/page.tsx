"use client";

import { useEffect, useState, useCallback } from "react";
import type { PriorityOrder, Task, TaskStatusFilter } from "@/lib/types/task";
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

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTasks({ q: debouncedQ, status, order });
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, status, order]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-6 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between">
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
        />

        {loading && <p className="text-sm opacity-70">Loading…</p>}
        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {!loading && !error && <TaskList tasks={tasks} onChanged={reload} />}
      </main>
    </div>
  );
}
