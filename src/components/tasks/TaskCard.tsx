import React from "react";
import { Task, Priority, Status } from "@/types/task";
import { Badge } from "@/components/common";
import { formatDueDate, isOverdue } from "@/utils/taskUtils";

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function priorityVariant(p: Priority) {
  switch (p) {
    case Priority.High:
      return "danger";
    case Priority.Medium:
      return "warning";
    case Priority.Low:
      return "success";
  }
}

function priorityBorder(p: Priority) {
  switch (p) {
    case Priority.High:
      return "border-l-red-400";
    case Priority.Medium:
      return "border-l-amber-400";
    case Priority.Low:
      return "border-l-emerald-400";
  }
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const done = task.status === Status.Completed;
  const overdue = !done && isOverdue(task.dueDate);

  return (
    <div
      className={`
        group relative flex flex-col p-5
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800
        border-l-4 ${priorityBorder(task.priority)}
        rounded-xl shadow-soft
        transition-all duration-200
        hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700
        ${done ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
          aria-label={done ? "Mark as pending" : "Mark as completed"}
          className={`
            flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center
            transition-all duration-200
            ${
              done
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-gray-300 dark:border-gray-600 hover:border-brand-500"
            }
          `}
        >
          {done && (
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Title */}
        <h3
          className={`
            flex-1 text-sm font-semibold leading-snug
            ${done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}
          `}
        >
          {task.title}
        </h3>

        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            aria-label="Edit task"
            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete task"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-12 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      {/* Bottom row: badges + due date */}
      <div className="flex items-center gap-2 mt-4 ml-12 flex-wrap">
        <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
        <Badge variant={done ? "success" : "default"}>{task.status}</Badge>
        <span className="ml-auto flex items-center gap-1">
          <svg
            className={`w-3.5 h-3.5 ${overdue ? "text-red-400" : "text-gray-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span
            className={`text-xs font-medium ${overdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            {formatDueDate(task.dueDate)}
          </span>
        </span>
      </div>
    </div>
  );
}
