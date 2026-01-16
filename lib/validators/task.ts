import { z } from "zod";

const categorySchema = z.enum(["work", "home", "study", "health", "other"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  priority: z.coerce.number().int().min(1).max(10).optional(),
  category: categorySchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    done: z.boolean().optional(),
    priority: z.coerce.number().int().min(1).max(10).optional(),
    category: categorySchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Body must contain at least one field",
  });

export const tasksQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["all", "done", "undone"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  category: z
    .enum(["all", "work", "home", "study", "health", "other"])
    .optional(),
});
