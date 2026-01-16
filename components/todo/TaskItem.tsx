"use client";

import { useState } from "react";
import type { Task } from "@/lib/types/task";
import { patchTask, removeTask } from "@/lib/api/tasks";
import { formatDateTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Home,
  GraduationCap,
  HeartPulse,
  Tag,
  X,
} from "lucide-react";

type Props = {
  task: Task;
  onUpdated: (patch: Partial<Task>) => void;
  onDeleted: () => void;
};

export function TaskItem({ task, onUpdated, onDeleted }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const handleToggleDone = async () => {
    const nextDone = !task.done;

    onUpdated({ done: nextDone });
    setIsPending(true);
    try {
      await patchTask(task.id, { done: nextDone });
    } catch (e) {
      onUpdated({ done: task.done });
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  const handlePriorityChange = async (value: string) => {
    const priority = Number(value);
    if (!Number.isFinite(priority)) return;

    onUpdated({ priority });
    setIsPending(true);
    try {
      await patchTask(task.id, { priority });
    } catch (e) {
      onUpdated({ priority: task.priority });
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await removeTask(task.id);
      setOpen(false);
      onDeleted();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  const categoryMeta = {
    work: { label: "Work", Icon: Briefcase, colorClass: "text-blue-600" },
    home: { label: "Home", Icon: Home, colorClass: "text-emerald-600" },
    study: {
      label: "Study",
      Icon: GraduationCap,
      colorClass: "text-violet-600",
    },
    health: { label: "Health", Icon: HeartPulse, colorClass: "text-rose-600" },
    other: { label: "Other", Icon: Tag, colorClass: "text-zinc-500" },
  } as const;

  const meta =
    task.category && task.category in categoryMeta
      ? categoryMeta[task.category as keyof typeof categoryMeta]
      : null;

  return (
    <li className="rounded-md border p-3 shadow">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-3">
          {/* Done/Undone */}
          <Checkbox
            checked={task.done}
            onCheckedChange={handleToggleDone}
            disabled={isPending}
            className="data-[state=checked]:bg-white data-[state=checked]:text-black"
          />

          <div className="flex items-center gap-2 min-w-0">
            {/* Category badge */}
            {meta && (
              <span className="flex items-center">
                <meta.Icon
                  className={`size-4 shrink-0 ${
                    task.done ? "text-zinc-400" : meta.colorClass
                  }`}
                />
              </span>
            )}

            {/* Title */}
            <span className={task.done ? "line-through opacity-60" : ""}>
              {task.title}
            </span>
          </div>

          {/* Created at */}
          <span className="text-xs opacity-50">
            {formatDateTime(task.createdAt)}
          </span>
        </label>

        <div className="flex items-center gap-3">
          {/* Priority */}
          <span className="text-xs opacity-70">priority:</span>

          <Select
            value={String(task.priority)}
            onValueChange={handlePriorityChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[70px] cursor-pointer">
              <SelectValue placeholder="prio" />
            </SelectTrigger>

            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((p) => (
                <SelectItem key={p} value={String(p)}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Delete dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="text-red-600 hover:text-red-700 hover:bg-white hover:border-red-500 cursor-pointer border shadow"
                aria-label="Delete task"
              >
                <X className="size-5" />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete task?</DialogTitle>
                <DialogDescription>
                  This action can`t be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </li>
  );
}
