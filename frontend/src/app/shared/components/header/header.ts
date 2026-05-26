import {
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { ROUTES } from '../../models/routes.constants';
import { ThemeToggle } from '../theme-toggle/theme-toggle';
import { UserStoreService } from '../../services/user-store-service/user-store-service';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'gt-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggle, UserMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStoreService);

  readonly isLoggedIn = this.authService.isAuthorized;
  readonly isAdmin = this.userStore.isAdmin;
  readonly isMobileMenuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly routes = ROUTES;
  readonly ROUTES = ROUTES;

  readonly menuItems = computed(() => {
    if (this.isAdmin()) {
      return [
        { label: 'Statistics', route: `/${ROUTES.STATISTICS}` },
        { label: 'Users', route: `/${ROUTES.ADMIN_USERS}` },
        { label: 'Surveys', route: `/${ROUTES.ADMIN_SURVEYS}` },
      ];
    }
    if (this.isLoggedIn()) {
      return [
        { label: 'Home', route: `/${ROUTES.MAIN_PAGE}` },
        { label: 'All Surveys', route: `/${ROUTES.SURVEYS}` },
        { label: 'About us', route: `/${ROUTES.ABOUT}` },
        { label: 'Contact', route: `/${ROUTES.CONTACT}` },
      ];
    }
    return [
      { label: 'Home', route: `/${ROUTES.MAIN_PAGE}` },
      { label: 'All Surveys', route: `/${ROUTES.SURVEYS}` },
      { label: 'About us', route: `/${ROUTES.ABOUT}` },
      { label: 'Contact', route: `/${ROUTES.CONTACT}` },
    ];
  });

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isScrolled.set(scrollPosition > 50);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate([`/${ROUTES.MAIN_PAGE}`]);
  }
}
