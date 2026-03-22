import React from "react";
import { TaskFilters, Priority, Status, ViewMode } from "@/types/task";

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function FilterBar({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const update = (partial: Partial<TaskFilters>) =>
    onChange({ ...filters, ...partial });

  const pillBase =
    "px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap";
  const pillActive = "bg-brand-600 text-white shadow-sm";
  const pillInactive =
    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";

  return (
    <div className="space-y-4">
      {/* Row 1: Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="
              w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              text-gray-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500
              transition-colors
            "
          />
          {filters.search && (
            <button
              onClick={() => update({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            className={`
              p-2 rounded-lg transition-all duration-150
              ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange("card")}
            aria-label="Card view"
            className={`
              p-2 rounded-lg transition-all duration-150
              ${
                viewMode === "card"
                  ? "bg-white dark:bg-gray-700 shadow-sm text-brand-600 dark:text-brand-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }
            `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/*  Filter options */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">
          Status:
        </span>
        {(["all", Status.Pending, Status.Completed] as const).map((s) => (
          <button
            key={s}
            onClick={() => update({ status: s })}
            className={`${pillBase} ${filters.status === s ? pillActive : pillInactive}`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1">
          Priority:
        </span>
        {(["all", Priority.Low, Priority.Medium, Priority.High] as const).map(
          (p) => (
            <button
              key={p}
              onClick={() => update({ priority: p })}
              className={`${pillBase} ${filters.priority === p ? pillActive : pillInactive}`}
            >
              {p === "all" ? "All" : p}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
