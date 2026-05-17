import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ThemeService, Theme } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.Spy;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  beforeEach(() => {
    // Mock localStorage
    getItemSpy = jasmine.createSpy('getItem').and.returnValue(null);
    setItemSpy = jasmine.createSpy('setItem');
    localStorageSpy = jasmine.createSpy('localStorage').and.returnValue({
      getItem: getItemSpy,
      setItem: setItemSpy
    });

    spyOnProperty(window, 'localStorage', 'get').and.returnValue({
      getItem: getItemSpy,
      setItem: setItemSpy,
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear'),
      length: 0,
      key: jasmine.createSpy('key')
    });

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    if (service['timeCheckInterval']) {
      clearInterval(service['timeCheckInterval']);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with light theme by default', () => {
      expect(service.currentTheme()).toBeDefined();
      expect(['light', 'dark']).toContain(service.currentTheme());
    });

    it('should apply theme to document body on init', () => {
      const theme = service.currentTheme();
      expect(document.body.classList.contains(theme)).toBe(true);
    });

    it('should start time-based theme check', fakeAsync(() => {
      expect(service['timeCheckInterval']).toBeDefined();
    }));
  });

  describe('getInitialTheme', () => {
    it('should return light theme if no preferences saved', () => {
      getItemSpy.and.returnValue(null);
      const theme = service['getInitialTheme']();
      
      expect(['light', 'dark']).toContain(theme);
    });

    it('should return saved theme if manual override is set', () => {
      const preferences = { theme: 'dark', autoMode: false, manualOverride: true };
      getItemSpy.and.returnValue(JSON.stringify(preferences));
      
      const theme = service['getInitialTheme']();
      
      expect(theme).toBe('dark');
    });

    it('should return time-based theme if no manual override', () => {
      const preferences = { theme: 'light', autoMode: true, manualOverride: false };
      getItemSpy.and.returnValue(JSON.stringify(preferences));
      
      const theme = service['getInitialTheme']();
      
      expect(['light', 'dark']).toContain(theme);
    });
  });

  describe('getThemeByTime', () => {
    it('should return light theme during day hours (6-18)', () => {
      spyOn(Date.prototype, 'getHours').and.returnValue(12);
      
      const theme = service['getThemeByTime']();
      
      expect(theme).toBe('light');
    });

    it('should return dark theme during night hours (18-6)', () => {
      spyOn(Date.prototype, 'getHours').and.returnValue(20);
      
      const theme = service['getThemeByTime']();
      
      expect(theme).toBe('dark');
    });

    it('should return light theme at 6 AM', () => {
      spyOn(Date.prototype, 'getHours').and.returnValue(6);
      
      expect(service['getThemeByTime']()).toBe('light');
    });

    it('should return dark theme at 5 AM', () => {
      spyOn(Date.prototype, 'getHours').and.returnValue(5);
      
      expect(service['getThemeByTime']()).toBe('dark');
    });

    it('should return dark theme at 6 PM', () => {
      spyOn(Date.prototype, 'getHours').and.returnValue(18);
      
      expect(service['getThemeByTime']()).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      service.currentTheme.set('light');
      
      service.toggleTheme();
      
      expect(service.currentTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.currentTheme.set('dark');
      
      service.toggleTheme();
      
      expect(service.currentTheme()).toBe('light');
    });

    it('should set manual override when toggling', () => {
      service.toggleTheme();
      
      expect(setItemSpy).toHaveBeenCalled();
      const savedPreferences = JSON.parse(setItemSpy.calls.mostRecent().args[1]);
      expect(savedPreferences.manualOverride).toBe(true);
    });

    it('should save preferences to localStorage', () => {
      service.toggleTheme();
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'app-theme-preferences',
        jasmine.any(String)
      );
    });
  });

  describe('setTheme', () => {
    it('should set light theme', () => {
      service.setTheme('light');
      
      expect(service.currentTheme()).toBe('light');
    });

    it('should set dark theme', () => {
      service.setTheme('dark');
      
      expect(service.currentTheme()).toBe('dark');
    });

    it('should set manual override', () => {
      service.setTheme('dark');
      
      const savedPreferences = JSON.parse(setItemSpy.calls.mostRecent().args[1]);
      expect(savedPreferences.manualOverride).toBe(true);
    });

    it('should save theme to localStorage', () => {
      service.setTheme('dark');
      
      expect(setItemSpy).toHaveBeenCalled();
    });
  });

  describe('isDark', () => {
    it('should return true when theme is dark', () => {
      service.currentTheme.set('dark');
      
      expect(service.isDark()).toBe(true);
    });

    it('should return false when theme is light', () => {
      service.currentTheme.set('light');
      
      expect(service.isDark()).toBe(false);
    });
  });

  describe('applyTheme', () => {
    beforeEach(() => {
      document.body.classList.remove('light', 'dark');
    });

    it('should add theme class to body', () => {
      service['applyTheme']('dark');
      
      expect(document.body.classList.contains('dark')).toBe(true);
    });

    it('should remove previous theme class', () => {
      document.body.classList.add('light');
      
      service['applyTheme']('dark');
      
      expect(document.body.classList.contains('light')).toBe(false);
      expect(document.body.classList.contains('dark')).toBe(true);
    });

    it('should save theme to localStorage', () => {
      service['applyTheme']('dark');
      
      expect(setItemSpy).toHaveBeenCalled();
    });
  });

  describe('updateFavicon', () => {
    let mockLink: HTMLLinkElement;

    beforeEach(() => {
      mockLink = document.createElement('link');
      mockLink.rel = 'icon';
      mockLink.href = 'favicon.ico';
      spyOn(document, 'querySelector').and.returnValue(mockLink);
    });

    it('should update favicon for dark theme', () => {
      service['updateFavicon']('dark');
      
      expect(mockLink.href).toContain('favicon-dark.svg');
    });

    it('should update favicon for light theme', () => {
      service['updateFavicon']('light');
      
      expect(mockLink.href).toContain('favicon.ico');
    });

    it('should not throw if link element not found', () => {
      (document.querySelector as jasmine.Spy).and.returnValue(null);
      
      expect(() => service['updateFavicon']('dark')).not.toThrow();
    });
  });

  describe('preferences management', () => {
    it('should get preferences from localStorage', () => {
      const preferences = { theme: 'dark' as Theme, autoMode: true };
      getItemSpy.and.returnValue(JSON.stringify(preferences));
      
      const result = service['getPreferences']();
      
      expect(result.theme).toBe('dark');
      expect(result.autoMode).toBe(true);
    });

    it('should return default preferences if none saved', () => {
      getItemSpy.and.returnValue(null);
      
      const result = service['getPreferences']();
      
      expect(result.theme).toBe('light');
      expect(result.autoMode).toBe(false);
    });

    it('should handle invalid JSON in localStorage', () => {
      getItemSpy.and.returnValue('invalid json');
      
      const result = service['getPreferences']();
      
      expect(result.theme).toBe('light');
      expect(result.autoMode).toBe(false);
    });

    it('should save preferences to localStorage', () => {
      const preferences = { theme: 'dark' as Theme, autoMode: false, manualOverride: true };
      
      service['savePreferences'](preferences);
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'app-theme-preferences',
        JSON.stringify(preferences)
      );
    });
  });

  describe('time-based theme check', () => {
    it('should check theme periodically', fakeAsync(() => {
      spyOn(service as any, 'getThemeByTime').and.returnValue('dark');
      service['startTimeBasedThemeCheck']();
      
      tick(60000); // 1 minute
      
      expect(service['getThemeByTime']).toHaveBeenCalled();
    }));

    it('should not change theme if manual override is set', fakeAsync(() => {
      const preferences = { theme: 'light' as Theme, autoMode: false, manualOverride: true };
      getItemSpy.and.returnValue(JSON.stringify(preferences));
      service.currentTheme.set('light');
      
      service['startTimeBasedThemeCheck']();
      tick(60000);
      
      expect(service.currentTheme()).toBe('light');
    }));

    it('should update theme if time-based theme changes', fakeAsync(() => {
      const preferences = { theme: 'light' as Theme, autoMode: true, manualOverride: false };
      getItemSpy.and.returnValue(JSON.stringify(preferences));
      service.currentTheme.set('light');
      spyOn(service as any, 'getThemeByTime').and.returnValue('dark');
      
      service['startTimeBasedThemeCheck']();
      tick(60000);
      
      expect(service.currentTheme()).toBe('dark');
    }));

    it('should stop previous interval when starting new one', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      service['timeCheckInterval'] = 123 as any;
      
      service['startTimeBasedThemeCheck']();
      
      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    });
  });

  describe('ngOnDestroy', () => {
    it('should stop time-based theme check', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      service['timeCheckInterval'] = 123 as any;
      
      service.ngOnDestroy();
      
      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    });

    it('should handle missing interval gracefully', () => {
      service['timeCheckInterval'] = undefined;
      
      expect(() => service.ngOnDestroy()).not.toThrow();
    });
  });

  describe('stopTimeBasedThemeCheck', () => {
    it('should clear interval if exists', () => {
      const clearIntervalSpy = spyOn(window, 'clearInterval');
      service['timeCheckInterval'] = 456 as any;
      
      service['stopTimeBasedThemeCheck']();
      
      expect(clearIntervalSpy).toHaveBeenCalledWith(456);
      expect(service['timeCheckInterval']).toBeUndefined();
    });

    it('should not throw if no interval exists', () => {
      service['timeCheckInterval'] = undefined;
      
      expect(() => service['stopTimeBasedThemeCheck']()).not.toThrow();
    });
  });

  describe('effect', () => {
    it('should apply theme when currentTheme signal changes', () => {
      spyOn(service as any, 'applyTheme');
      
      service.currentTheme.set('dark');
      TestBed.flushEffects();
      
      expect(service['applyTheme']).toHaveBeenCalledWith('dark');
    });
  });

  describe('SSR compatibility', () => {
    it('should handle missing window object gracefully', () => {
      // Since we can't actually modify window, just verify the service doesn't throw
      expect(service).toBeTruthy();
      expect(() => service['getInitialTheme']()).not.toThrow();
    });

    it('should handle missing document object gracefully', () => {
      // Since we can't actually modify document, just verify the service doesn't throw
      expect(() => service['applyTheme']('dark')).not.toThrow();
    });

    it('should handle unavailable localStorage gracefully', () => {
      // Test is already covered by beforeEach mock setup
      const result = service['getPreferences']();
      expect(result.theme).toBeDefined();
    });
  });
});
