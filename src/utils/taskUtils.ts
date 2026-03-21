import { Task, TaskFilters, Priority, Status } from '@/types/task';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    const query = filters.search.toLowerCase().trim();
    if (query) {
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDesc = task.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc) return false;
    }

    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });
}

export function getTaskCounts(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === Status.Completed).length;
  const pending = total - completed;
  return { total, completed, pending };
}

export function formatDueDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7) return `In ${diff} days`;

  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return due < today;
}

export function priorityWeight(p: Priority): number {
  const weights: Record<Priority, number> = {
    [Priority.High]: 3,
    [Priority.Medium]: 2,
    [Priority.Low]: 1,
  };
  return weights[p];
}
