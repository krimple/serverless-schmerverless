export interface Task {
  taskId?: number;
  taskOwner: string;
  description: string;
  priority: number;
  completed: boolean;
  dueDate: string;
}