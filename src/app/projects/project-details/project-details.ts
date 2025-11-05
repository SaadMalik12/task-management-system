import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Projects } from '../projects';
import { Task } from '../dashboard/project.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetails {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsService = inject(Projects);

  private readonly projectId = this.route.snapshot.paramMap.get('id')!;

  readonly project = computed(() =>
    this.projectsService.projects().find(p => p.id === this.projectId)
  );

  readonly showAddForm = signal(false);
  readonly editingTask = signal<Task | null>(null);
   readonly filterStatus = signal<'all' | 'todo' | 'in-progress' | 'done'>('all');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly filteredAndSortedTasks = computed(() => {
    const project = this.project();
    if (!project) return [];

    let tasks = [...project.tasks];

    // filter
    if (this.filterStatus() !== 'all') {
      tasks = tasks.filter(t => t.status === this.filterStatus());
    }

    // sort
    tasks.sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return this.sortOrder() === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return tasks;
  });

  onFilterChange(status: string): void {
    this.filterStatus.set(status as 'all' | 'todo' | 'in-progress' | 'done');
  }

  onSortChange(order: string): void {
    this.sortOrder.set(order as 'asc' | 'desc');
  }

  readonly taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    dueDate: [''],
  });

  readonly editTaskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    dueDate: [''],
  });

  toggleAddTaskForm(): void {
    this.showAddForm.update(show => !show);
  }

  onSubmitTask(): void {
    if (this.taskForm.invalid) return;
    const { title, description, dueDate } = this.taskForm.getRawValue();

    this.projectsService.addTask(this.projectId, {
      title,
      description,
      dueDate,
      status: 'todo',
    });

    this.taskForm.reset();
    this.showAddForm.set(false);
  }

  openEditForm(task: Task): void {
    this.editingTask.set(task);
    this.editTaskForm.setValue({
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate ?? '',
    });
  }

  cancelEdit(): void {
    this.editingTask.set(null);
  }

  onUpdateTask(taskId: string): void {
    if (this.editTaskForm.invalid) return;
    const { title, description, dueDate } = this.editTaskForm.getRawValue();

    this.projectsService.updateTask(this.projectId, taskId, {
      title,
      description,
      dueDate,
    });

    this.editingTask.set(null);
  }

  onDeleteTask(taskId: string): void {
    // const confirmDelete = confirm('Are you sure you want to delete this task?');
    // if (!confirmDelete) return;

    this.projectsService.deleteTask(this.projectId, taskId);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}