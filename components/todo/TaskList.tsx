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
    <div className="m-auto w-full h-[710px] pr-4 pl-14 py-4 bg-[url('/app-bg-mobile.png')] bg-contain bg-[position:0%_0%] bg-no-repeat overflow-hidden md:bg-[url('/app-bg-desktop.png')] md:pl-20 md:py-8 md:h-[650px] xl:pl-24 xl:h-[760px]">
      <ul className="w-full space-y-2 max-h-[calc(710px-32px)] overflow-y-auto pr-2 md:max-h-[calc(650px-64px)] xl:max-h-[calc(760px-64px)]">
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
