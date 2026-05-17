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

@Component({
  selector: 'gt-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggle],
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

  readonly menuItems = computed(() => [
    { label: 'Main page', route: `/${ROUTES.MAIN_PAGE}` },
    { label: 'All Surveys', route: `/${ROUTES.SURVEYS}` },
    { label: 'About us', route: `/${ROUTES.ABOUT}` },
    { label: 'Statistics', route: `/${ROUTES.STATISTICS}` },
    { label: 'Contact', route: `/${ROUTES.CONTACT}` },
    ...(this.isLoggedIn() ? [{ label: 'My Surveys', route: `/${ROUTES.USER_SURVEYS}` }] : []),
    ...(this.isAdmin() ? [
      { label: 'Surveys Admin', route: `/${ROUTES.ADMIN_SURVEYS}` },
      { label: 'Users', route: `/${ROUTES.ADMIN_USERS}` },
    ] : []),
  ]);

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

  navigateToProfile(): void {
    this.router.navigate([`/${ROUTES.USER_PROFILE}`]);
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate([`/${ROUTES.LOGIN}`]);
  }
}
