import { 
  Injectable, 
  signal, 
  effect, 
  Injector, 
  inject 
} from '@angular/core';

export type Theme = 'light' | 'dark';

export interface ThemePreferences {
  theme: Theme;
  autoMode: boolean; 
  manualOverride?: boolean; 
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly PREFERENCES_KEY = 'app-theme-preferences';
  private injector = inject(Injector);
  private timeCheckInterval?: number;
  
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
    effect(() => {
      this.applyTheme(this.currentTheme());
    }, { injector: this.injector });

    this.startTimeBasedThemeCheck();
  }

  private getInitialTheme(): Theme {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'light';
    }

    const preferences = this.getPreferences();
    
    if (preferences.manualOverride && preferences.theme) {
      return preferences.theme;
    }

    return this.getThemeByTime();
  }

  private getPreferences(): ThemePreferences {
    if (typeof localStorage === 'undefined') {
      return { theme: 'light', autoMode: false };
    }
    const saved = localStorage.getItem(this.PREFERENCES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { theme: 'light', autoMode: false };
      }
    }
    return { theme: 'light', autoMode: false };
  }

  private savePreferences(preferences: ThemePreferences): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
  }

  private getThemeByTime(): Theme {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }

  private startTimeBasedThemeCheck(): void {
    this.stopTimeBasedThemeCheck();
    
    this.timeCheckInterval = window.setInterval(() => {
      const preferences = this.getPreferences();

      if (preferences.manualOverride) {
        return;
      }

      const newTheme = this.getThemeByTime();
      if (newTheme !== this.currentTheme()) {
        this.currentTheme.set(newTheme);
        preferences.theme = newTheme;
        this.savePreferences(preferences);
      }
    }, 60000); 
  }

  private stopTimeBasedThemeCheck(): void {
    if (this.timeCheckInterval) {
      clearInterval(this.timeCheckInterval);
      this.timeCheckInterval = undefined;
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateFavicon(theme);
    
    const preferences = this.getPreferences();
    preferences.theme = theme;
    this.savePreferences(preferences);
  }

  private updateFavicon(theme: Theme): void {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = theme === 'dark' ? 'assets/images/favicon-dark.svg' : 'favicon.ico';
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
    
    const preferences = this.getPreferences();
    preferences.theme = newTheme;
    preferences.manualOverride = true;
    this.savePreferences(preferences);
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    const preferences = this.getPreferences();
    preferences.theme = theme;
    preferences.manualOverride = true;
    this.savePreferences(preferences);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  ngOnDestroy(): void {
    this.stopTimeBasedThemeCheck();
  }
}
