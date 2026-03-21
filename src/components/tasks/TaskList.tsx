import React from "react";
import { Task, ViewMode } from "@/types/task";
import { DragAndDropList } from "@/components/common/DragAndDrop";
import { TaskListItem } from "./TaskListItem";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/common";

interface TaskListProps {
  tasks: Task[];
  viewMode: ViewMode;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onCreateClick: () => void;
}

export function TaskList({
  tasks,
  viewMode,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  onCreateClick,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create a new task to get started, or adjust your filters to see existing tasks."
        action={
          <Button
            variant="primary"
            onClick={onCreateClick}
            icon={
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Create Task
          </Button>
        }
      />
    );
  }

  return (
    <DragAndDropList
      items={tasks}
      keyExtractor={(task) => task.id}
      onReorder={onReorder}
      grid={viewMode === "card"}
      renderItem={(task, _index, _isDragging) =>
        viewMode === "list" ? (
          <TaskListItem
            task={task}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task)}
          />
        ) : (
          <TaskCard
            task={task}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task)}
          />
        )
      }
    />
  );
}
