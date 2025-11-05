import { Routes } from '@angular/router';
import { authGuard } from './auth/login/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login').then(m => m.Login),
        title: 'Login',
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./projects/dashboard/dashboard').then(m => m.Dashboard),
        title: 'Project Dashboard',
    },
    {
        path: 'create-project',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./projects/create-project/create-project').then(
                m => m.CreateProjectComponent
            ),
        title: 'Create Project',
    },
    {
        path: 'projects/:id',
        data: { renderMode: 'client' },
        canActivate: [authGuard],
        loadComponent: () =>
            import('./projects/project-details/project-details').then(
                m => m.ProjectDetails
            ),
        title: 'Project Details',
    },
    {
        path: 'projects/:id/edit',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./projects/update-project/update-project').then(
                m => m.UpdateProject
            ),
        title: 'Edit Project',
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];