import { NextResponse } from "next/server";
import { createTaskSchema, tasksQuerySchema } from "@/lib/validators/task";
import { createTask, listTasks } from "@/lib/services/task.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsed = tasksQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    order: searchParams.get("order") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid query params" },
      { status: 400 }
    );
  }

  const tasks = await listTasks(parsed.data);
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const task = await createTask(parsed.data);
  return NextResponse.json(task, { status: 201 });
}
