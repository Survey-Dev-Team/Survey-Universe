import { 
  inject, 
  Injectable, 
  signal 
} from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage';
import { UserPrivateSummary } from '../../models/interfaces';

const USER_STORE_KEY = 'currentUser';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private localStorage = inject(LocalStorageService);

  currentUser = signal<UserPrivateSummary | null>(
    this.localStorage.getItem<UserPrivateSummary>(USER_STORE_KEY)
  );

  isAdmin = signal<boolean>(false);
  isWaiter = signal<boolean>(false);
  isCustomer = signal<boolean>(false);
  isLoggin = signal<boolean>(this.localStorage.hasToken());
  currentCode = signal<string>('');

  constructor() {
    const stored = this.localStorage.getItem<UserPrivateSummary>(USER_STORE_KEY);
    if (stored) {
      this.isAdmin.set(stored.role?.toLowerCase() === 'admin');
      this.isCustomer.set(stored.role?.toLowerCase() === 'user');
    }
  }

  setUser(user: UserPrivateSummary) {
    this.currentUser.set(user);
    this.localStorage.setItem(USER_STORE_KEY, user);
    this.isAdmin.set(user.role?.toLowerCase() === 'admin');
    this.isWaiter.set(false);
    this.isCustomer.set(user.role?.toLowerCase() === 'user');
  }

  getUser(): UserPrivateSummary | null {
    return this.currentUser();
  }

  clearUser(): void {
    this.currentUser.set(null);
    this.localStorage.removeItem(USER_STORE_KEY);
    this.isAdmin.set(false);
    this.isWaiter.set(false);
    this.isCustomer.set(false);
  }
}

