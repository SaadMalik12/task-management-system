// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);

  // simple check — you can replace this with a real auth service later
  const isLoggedIn = !!localStorage.getItem('auth_token');

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};