export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum Status {
  Pending = "Pending",
  Completed = "Completed",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
  createdAt: string;
  order: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface TaskFilters {
  search: string;
  status: "all" | Status;
  priority: "all" | Priority;
}

export type ViewMode = "list" | "card";
