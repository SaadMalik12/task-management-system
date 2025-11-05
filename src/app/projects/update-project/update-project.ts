import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Projects } from '../projects';

@Component({
  selector: 'app-edit-project',
  imports: [ReactiveFormsModule],
  templateUrl: './update-project.html',
  styleUrl: './update-project.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProject {
  private readonly fb = new FormBuilder();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsService = inject(Projects);

  readonly projectId = this.route.snapshot.paramMap.get('id')!;
  readonly project = this.projectsService.projects().find(p => p.id === this.projectId);

  readonly form = this.fb.nonNullable.group({
    name: [this.project?.name ?? '', [Validators.required, Validators.minLength(3)]],
    description: [this.project?.description ?? '', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.projectsService.updateProject(this.projectId, {
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
    });

    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}