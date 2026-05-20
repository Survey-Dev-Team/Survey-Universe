import { 
  Component, 
  inject,
  computed
} from '@angular/core';
import { 
  RouterLink 
} from '@angular/router';
import { LoginForm } from './components/login-form/login-form';
import { ROUTES } from '../../shared/models/routes.constants';
import { ThemeService } from '../../shared/services/theme-service/theme-service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'gt-login-page',
  imports: [
    RouterLink,
    LoginForm,
    ThemeToggle
],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  routes = ROUTES;
  private themeService = inject(ThemeService);
  registrationLinkRoute = `/${this.routes.REGISTER}`;
  readonly logoSrc = '/assets/icons/surveyflow/survey_universe_centauri_fixed_not_cropped_transparent.png';
  formImageSrc = computed(() => 
    this.themeService.currentTheme() === 'dark' 
      ? 'assets/images/form-page-img-dark.svg' 
      : 'assets/images/form-page-img.svg'
  );
}
