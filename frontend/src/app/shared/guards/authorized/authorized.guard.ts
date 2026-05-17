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
 * Authorized Guard
 * 
 * Route guard that protects routes requiring authentication.
 * Verifies that the user is logged in (has a valid token).
 * If not authorized, redirects to the login page.
 * 
 * @example
 * ```typescript
 * {
 *   path: 'profile',
 *   canActivate: [AuthorizedGuard],
 *   component: ProfileComponent
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorizedGuard implements CanLoad, CanActivate {
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
      ? true
      : this.router.createUrlTree([ROUTES.LOGIN]);
  }
}
