import {
  Component,
  HostListener,
  ElementRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth-service';
import { UserStoreService } from '../../services/user-store-service/user-store-service';
import { ROUTES } from '../../models/routes.constants';
import { UserRole } from '../../models/enums';

@Component({
  selector: 'gt-user-menu',
  imports: [RouterLink],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
})
export class UserMenu {
  private readonly authService = inject(AuthService);
  private readonly userStore = inject(UserStoreService);
  private readonly elRef = inject(ElementRef);

  readonly routes = ROUTES;
  readonly isOpen = signal(false);
  readonly currentUser = this.userStore.currentUser;
  readonly isAdmin = computed(() => this.currentUser()?.role === UserRole.Admin);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  logout(): void {
    this.close();
    this.authService.logout();
  }
}
