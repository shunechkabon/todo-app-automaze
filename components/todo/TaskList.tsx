import type { Task } from "@/lib/types/task";
import { TaskItem } from "@/components/todo/TaskItem";

type Props = {
  tasks: Task[];
  onTaskUpdated: (id: string, patch: Partial<Task>) => void;
  onTaskDeleted: (id: string) => void;
};

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: Props) {
  if (tasks.length === 0) {
    return <p className="text-sm opacity-60">No tasks yet</p>;
  }

  return (
    <div
      className="w-full h-screen pr-4 pl-24 py-8 bg-contain bg-[position:0%_0%] bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/app-bg.png')" }}
    >
      <ul className="w-full space-y-2 h-full overflow-y-auto pr-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdated={(patch) => onTaskUpdated(task.id, patch)}
            onDeleted={() => onTaskDeleted(task.id)}
          />
        ))}
      </ul>
    </div>
  );
}
