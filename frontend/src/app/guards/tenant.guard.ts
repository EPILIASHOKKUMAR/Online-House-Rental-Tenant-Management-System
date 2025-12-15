import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const tenantGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('userRole');
  
  if (role === 'tenant') {
    return true;
  }
  
  router.navigate(['/login'], { queryParams: { role: 'tenant' } });
  return false;
};
