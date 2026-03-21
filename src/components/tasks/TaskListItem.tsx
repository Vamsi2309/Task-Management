import React from 'react';
import { Task, Priority, Status } from '@/types/task';
import { Badge } from '@/components/common';
import { formatDueDate, isOverdue } from '@/utils/taskUtils';

interface TaskListItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Returns the appropriate Badge variant for a given priority. */
function priorityVariant(p: Priority) {
  switch (p) {
    case Priority.High:
      return 'danger';
    case Priority.Medium:
      return 'warning';
    case Priority.Low:
      return 'success';
  }
}

/**
 * A single task displayed as a horizontal row (list view).
 *
 * Visual indicators:
 *  - Completed tasks: strikethrough title + reduced opacity
 *  - Overdue tasks: red due-date label
 *  - Drag handle (grip icon) on the left
 */
export function TaskListItem({ task, onToggle, onEdit, onDelete }: TaskListItemProps) {
  const done = task.status === Status.Completed;
  const overdue = !done && isOverdue(task.dueDate);

  return (
    <div
      className={`
        group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        rounded-xl shadow-soft
        transition-all duration-200
        hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700
        ${done ? 'opacity-60' : ''}
      `}
    >
      {/* Drag handle */}
      <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={done ? 'Mark as pending' : 'Mark as completed'}
        className={`
          flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-all duration-200
          ${done
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-400'
          }
        `}
      >
        {done && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`
              text-sm font-semibold truncate
              ${done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}
            `}
          >
            {task.title}
          </h3>
          <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
          {task.description}
        </p>
      </div>

      {/* Due date */}
      <span
        className={`
          hidden sm:inline-flex text-xs font-medium flex-shrink-0
          ${overdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}
        `}
      >
        {formatDueDate(task.dueDate)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={onEdit}
          aria-label="Edit task"
          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
