import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store-service/user-store-service';
import { AuthService } from '../../services/auth-service/auth-service';
import { ROUTES } from '../../models/routes.constants';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const userStore = inject(UserStoreService);
  const router = inject(Router);

  if (!authService.isAuthorized()) {
    return router.createUrlTree([`/${ROUTES.LOGIN}`]);
  }

  return userStore.isAdmin()
    ? true
    : router.createUrlTree([`/${ROUTES.MAIN_PAGE}`]);
};
