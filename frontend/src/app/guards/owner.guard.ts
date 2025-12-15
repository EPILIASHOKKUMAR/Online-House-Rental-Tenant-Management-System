import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ownerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');
  
  if (role === 'owner') {
    return true;
  }
  
  router.navigate(['/login'], { queryParams: { role: 'owner' } });
  return false;
};
