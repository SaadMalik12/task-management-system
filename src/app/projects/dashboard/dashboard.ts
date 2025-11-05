import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { type Project } from './project.model';
import { Projects } from '../projects';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  host: {
    class: 'dashboard-page',
    role: 'main',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly projectsService = inject(Projects);
  private readonly router = inject(Router);

  readonly projects = this.projectsService.projects;

  /** Derived computed summary */
  readonly projectSummaries = computed(() =>
    this.projects().map(project => {
      const todo = project.tasks.filter(t => t.status === 'todo').length;
      const inProgress = project.tasks.filter(t => t.status === 'in-progress').length;
      const done = project.tasks.filter(t => t.status === 'done').length;
      const total = project.tasks.length;
      return { ...project, todo, inProgress, done, total };
    })
  );

  /** Computed totals across all projects */
  readonly totals = computed(() => {
    const all = this.projects().flatMap(p => p.tasks);
    return {
      todo: all.filter(t => t.status === 'todo').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      done: all.filter(t => t.status === 'done').length,
      total: all.length,
    };
  });

  onCreateProject(): void {
    this.router.navigate(['/create-project']);
  }

  onViewDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  onEditProject(projectId: string): void {
  this.router.navigate(['/projects', projectId, 'edit']);
}

onDeleteProject(projectId: string): void {
  // const confirmDelete = confirm('Are you sure you want to delete this project?');
  // if (!confirmDelete) return;

  this.projectsService.deleteProject(projectId);
}

logout(): void {
  localStorage.removeItem('auth_token');
  this.router.navigate(['/login']);
}

}