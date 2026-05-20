import { 
  Injectable, 
  Inject, 
  signal
} from '@angular/core';
import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>(
  'Window object',
  {
    providedIn: 'root',
    factory: () => window
  }
);

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {
  token = signal<string>('');
  private readonly TOKEN_KEY = 'SESSION_TOKEN';

  constructor(@Inject(WINDOW) private window: Window) {}

  setToken(token: string) {
    this.token.set(token);
    this.window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this.window.localStorage.getItem(this.TOKEN_KEY);
  }

  deleteToken() {
    this.window.localStorage.removeItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  setItem<T>(key: string, value: T): void {
    const jsonData = JSON.stringify(value);
    this.window.localStorage.setItem(key, jsonData);
  }

  getItem<T>(key: string): T | null {
    const jsonData = this.window.localStorage.getItem(key);
    if (jsonData && jsonData !== 'undefined' && jsonData !== 'null') {
      try {
        return JSON.parse(jsonData) as T;
      } catch (error) {
        console.error(`Error parsing JSON for key "${key}":`, error);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    this.window.localStorage.removeItem(key);
  }
}
