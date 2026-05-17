import { 
  inject, 
  Injectable, 
  signal 
} from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage';
import {
  UpdateUserData,
} from '../../../feature/user-profile/models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  currentUser = signal<UpdateUserData | null>(null);
  private localStorage = inject(LocalStorageService);

  isAdmin = signal<boolean>(false);
  isWaiter = signal<boolean>(false);
  isCustomer = signal<boolean>(false);
  isLoggin = signal<boolean>(this.localStorage.hasToken());
  currentCode = signal<string>('');

  setUser(user: UpdateUserData) {
    this.currentUser.set(user);
    this.isAdmin.set(user.role === 'ADMIN');
    this.isWaiter.set(user.role === 'WAITER');
    this.isCustomer.set(user.role === 'CUSTOMER');
  }

  getUser(): UpdateUserData | null {
    return this.currentUser();
  }

  clearUser(): void {
    this.currentUser.set(null);
    this.isAdmin.set(false);
    this.isWaiter.set(false);
    this.isCustomer.set(false);
  }
}

