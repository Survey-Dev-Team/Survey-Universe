import { 
  Injectable, 
  inject 
} from '@angular/core';
import { 
  CanLoad, 
  CanActivate, 
  Router, 
  UrlTree 
} from '@angular/router';

import { AuthService } from '../../services/auth-service/auth-service';
import { ROUTES } from '../../models/routes.constants';

/**
 * Non-Authorized Guard
 * 
 * Route guard that protects routes for non-authenticated users only (login, registration).
 * If user is already authorized, redirects to the main page.
 * 
 * @example
 * ```typescript
 * {
 *   path: 'login',
 *   canActivate: [NonAuthorizedGuard],
 *   component: LoginComponent
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class NonAuthorizedGuard implements CanLoad, CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canLoad(): boolean | UrlTree {
    return this.checkAuth();
  }

  canActivate(): boolean | UrlTree {
    return this.checkAuth();
  }

  private checkAuth(): boolean | UrlTree {
    return this.authService.isAuthorized()
      ? this.router.createUrlTree([ROUTES.MAIN_PAGE])
      : true;
  }
}
