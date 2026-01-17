"use client";

import type {
  PriorityOrder,
  TaskStatusFilter,
  TaskCategoryFilter,
} from "@/lib/types/task";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Home, GraduationCap, HeartPulse, Tag } from "lucide-react";

type Props = {
  q: string;
  onQChange: (value: string) => void;

  status: TaskStatusFilter;
  onStatusChange: (value: TaskStatusFilter) => void;

  order: PriorityOrder;
  onOrderChange: (value: PriorityOrder) => void;

  category: TaskCategoryFilter;
  onCategoryChange: (value: TaskCategoryFilter) => void;
};

export function TaskToolbar({
  q,
  onQChange,
  status,
  onStatusChange,
  order,
  onOrderChange,
  category,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:pl-7 xl:pl-8">
      {/* Search */}
      <div className="w-full md:max-w-xs">
        <Input
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Search…"
        />
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
        <div className="m-auto">
          {/* Done/Undone */}
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
        </div>

        <div className="flex w-full justify-between md:gap-3">
          {/* Categories */}
          <Select
            value={category}
            onValueChange={(v) => onCategoryChange(v as TaskCategoryFilter)}
          >
            <SelectTrigger className="max-w-[134px] w-full cursor-pointer md:max-w-[140px]">
              <SelectValue className="truncate" placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>

              <SelectItem value="work">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-4 text-blue-600" />
                  Work
                </div>
              </SelectItem>

              <SelectItem value="home">
                <div className="flex items-center gap-2">
                  <Home className="size-4 text-emerald-600" />
                  Home
                </div>
              </SelectItem>

              <SelectItem value="study">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-violet-600" />
                  Study
                </div>
              </SelectItem>

              <SelectItem value="health">
                <div className="flex items-center gap-2">
                  <HeartPulse className="size-4 text-rose-600" />
                  Health
                </div>
              </SelectItem>

              <SelectItem value="other">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-zinc-500" />
                  Other
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Priority */}
          <Select
            value={order}
            onValueChange={(v) => onOrderChange(v as PriorityOrder)}
          >
            <SelectTrigger className="max-w-[174px] w-full cursor-pointer">
              <SelectValue
                className="truncate"
                placeholder="Sort by priority"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Priority: low → high</SelectItem>
              <SelectItem value="desc">Priority: high → low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
