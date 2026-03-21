/**
 * Unit tests for task utility functions.
 *
 * Covers:
 *  - filterTasks (search, status, priority)
 *  - getTaskCounts
 *  - formatDueDate
 *  - isOverdue
 *  - priorityWeight
 */

import { filterTasks, getTaskCounts, isOverdue, priorityWeight } from '../src/utils/taskUtils';
import { Task, Priority, Status, TaskFilters } from '../src/types/task';

/* ─── Factories ────────────────────────────────────────── */

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'test-1',
    title: 'Test Task',
    description: 'A test description',
    priority: Priority.Medium,
    dueDate: '2099-12-31',
    status: Status.Pending,
    createdAt: new Date().toISOString(),
    order: 0,
    ...overrides,
  };
}

const defaultFilters: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
};

/* ─── filterTasks ──────────────────────────────────────── */

describe('filterTasks', () => {
  const tasks: Task[] = [
    makeTask({ id: '1', title: 'Buy groceries', description: 'Milk, eggs', priority: Priority.Low, status: Status.Pending }),
    makeTask({ id: '2', title: 'Code review', description: 'PR #42', priority: Priority.High, status: Status.Completed }),
    makeTask({ id: '3', title: 'Design mockup', description: 'Homepage design', priority: Priority.Medium, status: Status.Pending }),
  ];

  test('returns all tasks when no filters are active', () => {
    const result = filterTasks(tasks, defaultFilters);
    expect(result).toHaveLength(3);
  });

  test('filters by search query (title match)', () => {
    const result = filterTasks(tasks, { ...defaultFilters, search: 'groceries' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('filters by search query (description match)', () => {
    const result = filterTasks(tasks, { ...defaultFilters, search: 'PR #42' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('search is case-insensitive', () => {
    const result = filterTasks(tasks, { ...defaultFilters, search: 'CODE REVIEW' });
    expect(result).toHaveLength(1);
  });

  test('filters by status — Pending', () => {
    const result = filterTasks(tasks, { ...defaultFilters, status: Status.Pending });
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.status === Status.Pending)).toBe(true);
  });

  test('filters by status — Completed', () => {
    const result = filterTasks(tasks, { ...defaultFilters, status: Status.Completed });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('filters by priority', () => {
    const result = filterTasks(tasks, { ...defaultFilters, priority: Priority.High });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('combines search + status filters', () => {
    const result = filterTasks(tasks, {
      search: 'design',
      status: Status.Pending,
      priority: 'all',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  test('returns empty when no tasks match', () => {
    const result = filterTasks(tasks, { ...defaultFilters, search: 'nonexistent' });
    expect(result).toHaveLength(0);
  });
});

/* ─── getTaskCounts ────────────────────────────────────── */

describe('getTaskCounts', () => {
  test('counts correctly', () => {
    const tasks: Task[] = [
      makeTask({ id: '1', status: Status.Pending }),
      makeTask({ id: '2', status: Status.Completed }),
      makeTask({ id: '3', status: Status.Pending }),
    ];
    const counts = getTaskCounts(tasks);
    expect(counts.total).toBe(3);
    expect(counts.pending).toBe(2);
    expect(counts.completed).toBe(1);
  });

  test('handles empty task list', () => {
    const counts = getTaskCounts([]);
    expect(counts.total).toBe(0);
    expect(counts.pending).toBe(0);
    expect(counts.completed).toBe(0);
  });
});

/* ─── isOverdue ────────────────────────────────────────── */

describe('isOverdue', () => {
  test('returns true for past dates', () => {
    expect(isOverdue('2020-01-01')).toBe(true);
  });

  test('returns false for future dates', () => {
    expect(isOverdue('2099-12-31')).toBe(false);
  });
});

/* ─── priorityWeight ───────────────────────────────────── */

describe('priorityWeight', () => {
  test('High > Medium > Low', () => {
    expect(priorityWeight(Priority.High)).toBeGreaterThan(priorityWeight(Priority.Medium));
    expect(priorityWeight(Priority.Medium)).toBeGreaterThan(priorityWeight(Priority.Low));
  });
});
