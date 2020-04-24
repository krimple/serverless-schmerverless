export interface Task {
  id?: number;
  taskOwner: string;
  description: string;
  priority: number;
  completed: boolean;
  dueDate: string;
}