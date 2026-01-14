import { NextResponse } from "next/server";
import { updateTaskSchema } from "@/lib/validators/task";
import { deleteTask, updateTask } from "@/lib/services/task.service";

function parseId(id: string) {
  const trimmed = id?.trim();
  return trimmed ? trimmed : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;

  const id = parseId(rawId);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  const body = await req.json().catch(() => null);

  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  try {
    const task = await updateTask(id, parsed.data);
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;

  const id = parseId(rawId);
  if (!id) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

  try {
    await deleteTask(id);
    return new Response(null, { status: 204 });
  } catch {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }
}
