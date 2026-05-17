import { 
  Component, 
  inject, 
  computed
} from '@angular/core';
import { 
  Router, 
  RouterLink 
} from '@angular/router';
import { RegistrationForm } from './components/registration-form/registration-form';
import { ROUTES } from '../../shared/models/routes.constants';
import { ThemeService } from '../../shared/services/theme-service/theme-service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'gt-registration-page',
  imports: [
    RegistrationForm, 
    RouterLink,
    ThemeToggle
  ],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss'
})
export class RegistrationPage {
  routes = ROUTES;
  LoginLinkRoute = `/${this.routes.LOGIN}`;
  private themeService = inject(ThemeService);
  logoSrc = computed(() => 
    this.themeService.currentTheme() === 'dark' 
      ? '/assets/icons/surveyflow/survey_universe_centauri_fixed_not_cropped_transparent.png' 
      : '/assets/icons/surveyflow/survey_universe_centauri_fixed_not_cropped_transparent.png'
  );
  formImageSrc = computed(() => 
    this.themeService.currentTheme() === 'dark' 
      ? 'assets/images/form-page-img-dark.svg' 
      : 'assets/images/form-page-img.svg'
  );
  private router = inject(Router);

  onRegistrationSuccess(_email: string) {
    this.router.navigate([`/${this.routes.LOGIN}`]);
  }
}
