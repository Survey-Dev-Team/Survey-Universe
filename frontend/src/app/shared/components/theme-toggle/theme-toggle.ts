import { 
  Component, 
  inject 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme-service/theme-service';

@Component({
  selector: 'gt-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss'
})
export class ThemeToggle {
  themeService = inject(ThemeService);
  isDark = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
