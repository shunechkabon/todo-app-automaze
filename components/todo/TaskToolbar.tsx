"use client";

import type { PriorityOrder, TaskStatusFilter } from "@/lib/types/task";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  q: string;
  onQChange: (value: string) => void;

  status: TaskStatusFilter;
  onStatusChange: (value: TaskStatusFilter) => void;

  order: PriorityOrder;
  onOrderChange: (value: PriorityOrder) => void;
};

export function TaskToolbar({
  q,
  onQChange,
  status,
  onStatusChange,
  order,
  onOrderChange,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="w-full sm:max-w-xs">
        <Input
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Search…"
        />
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        {/* Filters */}
        <Tabs
          value={status}
          onValueChange={(v) => onStatusChange(v as TaskStatusFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
            <TabsTrigger value="undone">Undone</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sort */}
        <Select
          value={order}
          onValueChange={(v) => onOrderChange(v as PriorityOrder)}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Sort by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Priority: low → high</SelectItem>
            <SelectItem value="desc">Priority: high → low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
