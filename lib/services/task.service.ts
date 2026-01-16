import "server-only";
import { prisma } from "@/lib/db/prisma";

type ListArgs = {
  q?: string;
  status?: "all" | "done" | "undone";
  order?: "asc" | "desc";
  category?: "all" | "work" | "home" | "study" | "health" | "other";
};

export async function listTasks(args: ListArgs) {
  const q = args.q?.trim() || "";
  const status = args.status ?? "all";
  const order = args.order ?? "asc";
  const category = args.category ?? "all";

  const where: {
    title?: { contains: string; mode: "insensitive" };
    done?: boolean;
    category?: string;
  } = {};
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (status === "done") where.done = true;
  if (status === "undone") where.done = false;
  if (category !== "all") where.category = category;

  return prisma.task.findMany({
    where,
    orderBy: { priority: order },
  });
}

export async function createTask(data: {
  title: string;
  priority?: number;
  category?: "work" | "home" | "study" | "health" | "other";
}) {
  return prisma.task.create({
    data: {
      title: data.title.trim(),
      priority: data.priority ?? 5,
      category: data.category ?? "other",
    },
  });
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    done?: boolean;
    priority?: number;
    category?: "work" | "home" | "study" | "health" | "other";
  }
) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}
