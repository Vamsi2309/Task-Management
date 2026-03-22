import { v4 as uuidv4 } from "uuid";
import { Task, TaskFormData, TaskFilters, Status } from "@/types/task";
import { useLocalStorage } from "./useLocalStorage";
import { filterTasks, getTaskCounts } from "@/utils/taskUtils";

const STORAGE_KEY = "taskflow_tasks";

export function useTasks(filters: TaskFilters) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  const filteredTasks = filterTasks(sortedTasks, filters);
  const counts = getTaskCounts(tasks);

  /** Create a new task and append it at the end. */
  function addTask(data: TaskFormData) {
    const newTask: Task = {
      id: uuidv4(),
      ...data,
      status: Status.Pending,
      createdAt: new Date().toISOString(),
      order: tasks.length,
    };
    setTasks((prev) => [...prev, newTask]);
  }

  /** Update an existing task (partial update). */
  function updateTask(id: string, data: Partial<TaskFormData>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }

  /** Remove a task by id. */
  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  /** Toggle status between Pending ↔ Completed. */
  function toggleStatus(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === Status.Pending ? Status.Completed : Status.Pending,
            }
          : t,
      ),
    );
  }

  /** Reorder tasks after a drag-and-drop action. */
  function reorderTasks(fromIndex: number, toIndex: number) {
    setTasks((prev) => {
      const reordered = [...prev].sort((a, b) => a.order - b.order);

      const draggedId = filteredTasks[fromIndex]?.id;
      const targetId = filteredTasks[toIndex]?.id;
      if (!draggedId || !targetId) return prev;

      const fullFrom = reordered.findIndex((t) => t.id === draggedId);
      const fullTo = reordered.findIndex((t) => t.id === targetId);
      if (fullFrom === -1 || fullTo === -1) return prev;

      const [moved] = reordered.splice(fullFrom, 1);
      reordered.splice(fullTo, 0, moved);

      return reordered.map((t, i) => ({ ...t, order: i }));
    });
  }

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    counts,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
    reorderTasks,
  };
}
