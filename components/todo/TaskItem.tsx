"use client";

import { useState } from "react";
import type { Task } from "@/lib/types/task";
import { patchTask, removeTask } from "@/lib/api/tasks";
import { formatDateTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
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

type Props = {
  task: Task;
  onChanged: () => void;
};

export function TaskItem({ task, onChanged }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const handleToggleDone = async () => {
    setIsPending(true);
    try {
      await patchTask(task.id, { done: !task.done });
      onChanged();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  const handlePriorityChange = async (value: string) => {
    const priority = Number(value);
    if (!Number.isFinite(priority)) return;

    setIsPending(true);
    try {
      await patchTask(task.id, { priority });
      onChanged();
    } catch (e) {
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
      onChanged();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <li className="rounded-md border p-3">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-3">
          {/* Done/Undone */}
          <input
            type="checkbox"
            checked={task.done}
            onChange={handleToggleDone}
            disabled={isPending}
            className="h-4 w-4"
          />

          {/* Title */}
          <span className={task.done ? "line-through opacity-60" : ""}>
            {task.title}
          </span>

          {/* Created at */}
          <span className="text-xs opacity-50">
            created: {formatDateTime(task.createdAt)}
          </span>
        </label>

        <div className="flex items-center gap-3">
          {/* Priority */}
          <span className="text-xs opacity-70">priority</span>

          <Select
            value={String(task.priority)}
            onValueChange={handlePriorityChange}
            disabled={isPending}
          >
            <SelectTrigger className="w-[90px]">
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
              <Button variant="destructive" size="sm" disabled={isPending}>
                Delete
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
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isPending}
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
