import { Injectable, signal } from '@angular/core';
import { type Project, type Task } from './dashboard/project.model';

@Injectable({
  providedIn: 'root',
})
export class Projects {
  private readonly _projects = signal<Project[]>([
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhaul company site with a new design system.',
    tasks: [
      {
        id: 't1',
        title: 'Wireframes',
        description: 'Create low-fidelity wireframes for homepage and product pages.',
        dueDate: '2025-11-15',
        status: 'done',
      },
      {
        id: 't2',
        title: 'High-Fidelity Mockups',
        description: 'Design polished UI mockups using the approved style guide.',
        dueDate: '2025-11-20',
        status: 'in-progress',
      },
      {
        id: 't3',
        title: 'Responsive Testing',
        description: 'Ensure layouts are mobile-friendly across common breakpoints.',
        dueDate: '2025-11-25',
        status: 'todo',
      },
      {
        id: 't4',
        title: 'Content Audit',
        description: 'Review existing site content and flag outdated sections.',
        dueDate: '2025-11-18',
        status: 'todo',
      },
    ],
  },
  {
    id: 'p2',
    name: 'Mobile App',
    description: 'Develop MVP for the customer portal app.',
    tasks: [
      {
        id: 't5',
        title: 'Setup Authentication',
        description: 'Implement email and social login using Firebase Auth.',
        dueDate: '2025-11-10',
        status: 'done',
      },
      {
        id: 't6',
        title: 'Push Notifications',
        description: 'Integrate push notifications for user updates and alerts.',
        dueDate: '2025-11-22',
        status: 'todo',
      },
      {
        id: 't7',
        title: 'API Integration',
        description: 'Connect app to backend REST API for user data and orders.',
        dueDate: '2025-11-19',
        status: 'in-progress',
      },
      {
        id: 't8',
        title: 'Offline Support',
        description: 'Enable local caching and data sync for offline use.',
        dueDate: '2025-11-27',
        status: 'todo',
      },
    ],
  },
  {
    id: 'p4',
    name: 'E-Commerce Platform',
    description: 'Upgrade the shopping cart and payment gateway modules.',
    tasks: [
      {
        id: 't13',
        title: 'Checkout Flow Redesign',
        description: 'Simplify checkout steps and improve conversion rates.',
        dueDate: '2025-11-21',
        status: 'todo',
      },
      {
        id: 't14',
        title: 'Add Product Recommendations',
        description: 'Integrate machine-learning recommendations to increase sales.',
        dueDate: '2025-11-19',
        status: 'in-progress',
      },
      {
        id: 't15',
        title: 'Stripe Integration',
        description: 'Migrate to Stripe for secure and modern payments.',
        dueDate: '2025-11-08',
        status: 'done',
      },
      {
        id: 't16',
        title: 'Performance Optimization',
        description: 'Improve load times and Core Web Vitals metrics.',
        dueDate: '2025-11-29',
        status: 'in-progress',
      },
    ],
  },
]);

  readonly projects = this._projects.asReadonly();

  // -----------------------------
  // 🔹 PROJECT CRUD METHODS
  // -----------------------------

  addNewProject(project: Project): void {
    this._projects.update(projects => [...projects, project]);
  }

  updateProject(projectId: string, updates: Partial<{ name: string; description: string }>): void {
    this._projects.update(projects =>
      projects.map(p => (p.id === projectId ? { ...p, ...updates } : p))
    );
  }

  deleteProject(projectId: string): void {
    this._projects.update(projects => projects.filter(p => p.id !== projectId));
  }

  // -----------------------------
  // 🔹 TASK CRUD METHODS
  // -----------------------------

  /** ✅ Add a new task to a project */
  addTask(
  projectId: string,
  task: { title: string; status: 'todo' | 'in-progress' | 'done'; description?: string; dueDate?: string }
): void {
  const newTask = {
    id: crypto.randomUUID(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    status: task.status,
  };

  this._projects.update(projects =>
    projects.map(p =>
      p.id === projectId ? { ...p, tasks: [...p.tasks, newTask] } : p
    )
  );
}

  // Update a specific task
  updateTask(
  projectId: string,
  taskId: string,
  updates: Partial<{
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    description: string;
    dueDate: string;
  }>
): void {
  this._projects.update(projects =>
    projects.map(p =>
      p.id === projectId
        ? {
            ...p,
            tasks: p.tasks.map(t =>
              t.id === taskId ? { ...t, ...updates } : t
            ),
          }
        : p
    )
  );
}


  /** 🗑️ Delete a task by ID */
  deleteTask(projectId: string, taskId: string): void {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) }
          : p
      )
    );
  }
}