import type { Task } from "@/lib/types/task";
import { TaskItem } from "@/components/todo/TaskItem";

type Props = {
  tasks: Task[];
  onChanged: () => void;
};

export function TaskList({ tasks, onChanged }: Props) {
  if (tasks.length === 0) {
    return <p className="text-sm opacity-60">No tasks yet</p>;
  }

  return (
    <ul className="w-full space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onChanged={onChanged} />
      ))}
    </ul>
  );
}
