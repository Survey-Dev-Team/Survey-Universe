import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { ROUTES } from '../../models/routes.constants';

export const authorizedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthorized()
    ? true
    : router.createUrlTree([`/${ROUTES.LOGIN}`]);
};

