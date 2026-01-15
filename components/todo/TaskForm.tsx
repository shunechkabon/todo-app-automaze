"use client";

import { useState } from "react";
import { addTask } from "@/lib/api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onCreated: () => void;
};

export function TaskForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string>("5");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Title is required");
      return;
    }

    const pr = Number(priority);
    if (!Number.isFinite(pr) || pr < 1 || pr > 10) {
      setError("Priority must be between 1 and 10");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      await addTask({ title: trimmed, priority: pr });
      setOpen(false);
      setTitle("");
      setPriority("5");
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create task");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (isPending ? null : setOpen(v))}>
      <DialogTrigger asChild>
        <Button>Create task +</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Add a new task with title and priority.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Buy oat milk"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={priority}
              onValueChange={setPriority}
              disabled={isPending}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="priority" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
