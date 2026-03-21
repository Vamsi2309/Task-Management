import { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import { Task, TaskFormData, TaskFilters, Status } from "@/types/task";
import { useLocalStorage } from "./useLocalStorage";
import { filterTasks, getTaskCounts } from "@/utils/taskUtils";

const STORAGE_KEY = "taskflow_tasks";

export function useTasks(filters: TaskFilters) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.order - b.order),
    [tasks],
  );

  const filteredTasks = useMemo(
    () => filterTasks(sortedTasks, filters),
    [sortedTasks, filters],
  );

  const counts = useMemo(() => getTaskCounts(tasks), [tasks]);

  /** Create a new task and append it at the end. */
  const addTask = useCallback(
    (data: TaskFormData) => {
      const newTask: Task = {
        id: uuidv4(),
        ...data,
        status: Status.Pending,
        createdAt: new Date().toISOString(),
        order: tasks.length,
      };
      setTasks((prev) => [...prev, newTask]);
    },
    [tasks.length, setTasks],
  );

  /** Update an existing task (partial update). */
  const updateTask = useCallback(
    (id: string, data: Partial<TaskFormData>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
      );
    },
    [setTasks],
  );

  /** Remove a task by id. */
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  /** Toggle status between Pending ↔ Completed. */
  const toggleStatus = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status:
                  t.status === Status.Pending
                    ? Status.Completed
                    : Status.Pending,
              }
            : t,
        ),
      );
    },
    [setTasks],
  );

  // Reorder tasks after a drag-and-drop action.

  const reorderTasks = useCallback(
    (fromIndex: number, toIndex: number) => {
      setTasks((prev) => {
        const reordered = [...prev].sort((a, b) => a.order - b.order);

        // Find the actual task ids from the filtered list
        const draggedId = filteredTasks[fromIndex]?.id;
        const targetId = filteredTasks[toIndex]?.id;
        if (!draggedId || !targetId) return prev;

        // Find positions in the full sorted array
        const fullFrom = reordered.findIndex((t) => t.id === draggedId);
        const fullTo = reordered.findIndex((t) => t.id === targetId);
        if (fullFrom === -1 || fullTo === -1) return prev;

        // Move the item
        const [moved] = reordered.splice(fullFrom, 1);
        reordered.splice(fullTo, 0, moved);

        // Re-assign sequential order values
        return reordered.map((t, i) => ({ ...t, order: i }));
      });
    },
    [setTasks, filteredTasks],
  );

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
