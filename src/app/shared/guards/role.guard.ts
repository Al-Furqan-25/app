import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentRole = authService.getUserRole();
  
  const allowedRoles = route.data['roles'] as string[];

  if (currentRole && allowedRoles.includes(currentRole)) {
    return true; 
  }

  router.navigate(['/login']);
  return false;
};