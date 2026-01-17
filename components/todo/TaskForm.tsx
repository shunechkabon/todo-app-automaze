"use client";

import { useState } from "react";
import { addTask } from "@/lib/api/tasks";
import { Briefcase, Home, GraduationCap, HeartPulse, Tag } from "lucide-react";
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
  const [category, setCategory] = useState<
    "work" | "home" | "study" | "health" | "other"
  >("other");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    setTitle("");
    setPriority("5");
    setCategory("other");
    setError(null);
  };

  const handleOpenChange = (v: boolean) => {
    if (isPending) return;
    if (!v) resetForm();
    setOpen(v);
  };

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
      await addTask({ title: trimmed, priority: pr, category });
      resetForm();
      setOpen(false);
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create task");
    } finally {
      setIsPending(false);
    }
  };

  const categories = [
    {
      value: "work",
      label: "Work",
      Icon: Briefcase,
      colorClass: "text-blue-600",
    },
    {
      value: "home",
      label: "Home",
      Icon: Home,
      colorClass: "text-emerald-600",
    },
    {
      value: "study",
      label: "Study",
      Icon: GraduationCap,
      colorClass: "text-violet-600",
    },
    {
      value: "health",
      label: "Health",
      Icon: HeartPulse,
      colorClass: "text-rose-600",
    },
    { value: "other", label: "Other", Icon: Tag, colorClass: "text-zinc-500" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer shadow">Add task +</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>
          <DialogDescription>
            Add a new task with title, category and priority.
          </DialogDescription>
        </DialogHeader>

        <form
          onKeyDownCapture={(e) => {
            if (e.key !== "Enter" || isPending) return;
            if (document.querySelector("[data-radix-select-content]")) return;

            e.preventDefault();
            void handleCreate();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            void handleCreate();
          }}
        >
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Buy oat milk"
                disabled={isPending}
              />
            </div>

            <div className="flex gap-8 mb-2">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>

                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as typeof category)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-[120px] cursor-pointer">
                    <SelectValue placeholder="category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map(({ value, label, Icon, colorClass }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`size-4 ${colorClass}`} />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={priority}
                  onValueChange={setPriority}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-[100px] cursor-pointer">
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
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Buttons */}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="cursor-pointer"
            >
              {isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
