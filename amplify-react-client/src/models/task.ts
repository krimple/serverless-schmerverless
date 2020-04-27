export interface Task {
  taskId?: string;
  taskOwner: string;
  description: string;
  priority: number;
  completed: boolean;
  completedDate?: string;
  dueDate: string;
}