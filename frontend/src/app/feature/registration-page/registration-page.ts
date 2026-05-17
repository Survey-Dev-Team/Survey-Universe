import { 
  Component, 
  inject, 
  OnInit, 
  signal,
  DestroyRef,
  computed
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { 
  ActivatedRoute, 
  Router, 
  RouterLink 
} from '@angular/router';
import { RegistrationForm } from './components/registration-form/registration-form';
import { ROUTES } from '../../shared/models/routes.constants';
import { ThemeService } from '../../shared/services/theme-service/theme-service';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';
import { EnterVerificationCodeForm } from '../../shared/components/enter-verification-code-form/enter-verification-code-form';

@Component({
  selector: 'gt-registration-page',
  imports: [
    RegistrationForm, 
    RouterLink,
    EnterVerificationCodeForm,
    ThemeToggle
  ],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss'
})
export class RegistrationPage implements OnInit {
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
  showVerificationForm = signal<boolean>(false);
  registeredEmail = signal<string>('');
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
      if (params['isVerificationCodeForm'] === 'true') {
        const storedEmail = localStorage.getItem('registrationEmail');
        if (storedEmail) {
          this.registeredEmail.set(storedEmail);
          this.showVerificationForm.set(true);
        }
      } else {
        this.showVerificationForm.set(false);
        this.registeredEmail.set('');
      }
    });
  }

  onRegistrationSuccess(email: string) {
    this.registeredEmail.set(email);
    this.showVerificationForm.set(true);
    localStorage.setItem('registrationEmail', email);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { isVerificationCodeForm: 'true' },
      queryParamsHandling: 'merge'
    });
  }
}
