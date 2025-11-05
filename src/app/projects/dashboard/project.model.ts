type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: 'todo' | 'in-progress' | 'done';
}


export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}