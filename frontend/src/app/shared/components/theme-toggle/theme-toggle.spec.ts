import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '../../services/theme-service/theme-service';
import { signal } from '@angular/core';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      currentTheme: signal('light')
    });

    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with theme from service', () => {
    expect(component.isDark()).toBe('light');
  });

  it('should call toggleTheme on themeService when toggleTheme is called', () => {
    component.toggleTheme();
    
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should respond to theme changes from service', () => {
    themeService.currentTheme.set('dark');
    
    expect(component.isDark()).toBe('dark');
  });

  it('should have themeService injected', () => {
    expect(component.themeService).toBeDefined();
    expect(component.themeService).toBe(themeService);
  });

  it('should call toggleTheme multiple times', () => {
    component.toggleTheme();
    component.toggleTheme();
    component.toggleTheme();
    
    expect(themeService.toggleTheme).toHaveBeenCalledTimes(3);
  });
});
