import React, { useState, useCallback } from 'react';
import { Task, TaskFilters, TaskFormData, ViewMode } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Modal, ConfirmDialog, Button } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { TaskStats } from './TaskStats';
import { FilterBar } from './FilterBar';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

export function Dashboard() {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });

  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    'taskflow_viewmode',
    'list'
  );

  const {
    tasks,
    counts,
    addTask,
    updateTask,
    deleteTask,
    toggleStatus,
    reorderTasks,
  } = useTasks(filters);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleCreate = useCallback(
    (data: TaskFormData) => {
      addTask(data);
      setIsCreateOpen(false);
    },
    [addTask]
  );

  const handleEdit = useCallback(
    (data: TaskFormData) => {
      if (editingTask) {
        updateTask(editingTask.id, data);
        setEditingTask(null);
      }
    },
    [editingTask, updateTask]
  );

  const handleDelete = useCallback(() => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  }, [deletingTask, deleteTask]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <TaskStats
          total={counts.total}
          pending={counts.pending}
          completed={counts.completed}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <FilterBar
                filters={filters}
                onChange={setFilters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />  
            </div>
            <Button
              variant="primary"
              size="md"
              className="self-start flex-shrink-0"
              onClick={() => setIsCreateOpen(true)}
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
              New Task
            </Button>
          </div>
        </div>

        <TaskList
          tasks={tasks}
          viewMode={viewMode}
          onToggle={toggleStatus}
          onEdit={(task) => setEditingTask(task)}
          onDelete={(task) => setDeletingTask(task)}
          onReorder={reorderTasks}
          onCreateClick={() => setIsCreateOpen(true)}
        />
      </main>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleEdit}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
