import { Component, computed, inject } from '@angular/core';
import { PageHeaderRole } from '../../shared/components/page-header-role/page-header-role';
import { UserStoreService } from '../../shared/services/user-store-service/user-store-service';
import { Header } from "../../shared/components/header/header";
import { ButtonText } from '../../shared/models/buttons.constants';
import { AuthService } from '../../shared/services/auth-service/auth-service';
import { ROUTES } from '../../shared/models/routes.constants';
import { UpdateUserDataForm } from "./components/update-user-data-form/update-user-data-form";
import { UsersService } from '../../shared/services/users/users.service';


@Component({
  selector: 'gt-user-profile',
  imports: [
    PageHeaderRole, 
    Header, 
    UpdateUserDataForm,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile {
  userStoreService = inject(UserStoreService);
  usersService = inject(UsersService);
  protected readonly ButtonText = ButtonText;
  isLoggedIn = inject(AuthService).isAuthorized;
  currentUser = this.userStoreService.currentUser;
  currentUserRole = computed(() => {
    const user = this.currentUser();
    if (!user?.role) return '';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
  });

  routes = ROUTES;
  LoginLinkRoute = `/${this.routes.LOGIN}`;

  deleteAccount(): void {
    const urlId = this.userStoreService.getUser()?.urlId;
    if (!urlId) return;
    this.usersService.deleteUser(urlId);
  }
}
