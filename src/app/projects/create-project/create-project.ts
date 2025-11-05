import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { type Project } from '../dashboard/project.model';
import { Projects } from '../projects';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectComponent {
  private readonly fb = new FormBuilder();
  private readonly projectsService = inject(Projects);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
  });

  readonly tasks = signal<{ title: string; status: 'todo' | 'in-progress' | 'done' }[]>([]);
  readonly newTaskTitle = signal('');
  readonly newTaskStatus = signal<'todo' | 'in-progress' | 'done'>('todo');

  addTask(): void {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    this.tasks.update(tasks => [
      ...tasks,
      { title, status: this.newTaskStatus() },
    ]);
    this.newTaskTitle.set('');
    this.newTaskStatus.set('todo');
  }

  removeTask(index: number): void {
    this.tasks.update(tasks => tasks.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const id = crypto.randomUUID();
    const project: Project = {
      id,
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      tasks: this.tasks().map(t => ({ ...t, id: crypto.randomUUID() })),
    };

    //  Add project to global signal state
    this.projectsService.addNewProject(project);

    // Navigate back to Dashboard
    this.router.navigate(['/dashboard']);
  }
}