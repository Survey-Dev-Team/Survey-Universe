import { 
  Injectable, 
  Inject, 
  signal
} from '@angular/core';
import { InjectionToken } from '@angular/core';
import { ReservationData } from '../../models/interfaces';

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
  isPreorderPage = signal<boolean>(false);
  reservationData = signal<ReservationData | null>(null);
  TOKEN = signal<string>('SESSION_TOKEN');

  constructor(@Inject(WINDOW) private window: Window) {}

  setToken(token: string) {
    this.token.set(token);
    this.window.localStorage.setItem(this.TOKEN(), token);
  }

  setIsPreorderPage(isPreorder: boolean) {
    this.isPreorderPage.set(isPreorder);
    this.window.localStorage.setItem('isPreorderPage', String(isPreorder));
  }

  setReservationData(data: ReservationData | null) {
    this.reservationData.set(data);
    this.window.localStorage.setItem('reservationData', JSON.stringify(data));
  }

  getReservationData(): ReservationData | null {
    const data = this.window.localStorage.getItem('reservationData');
    return data ? JSON.parse(data) : null;
  }

  getIsPreorderPage(): boolean {
    const value = this.window.localStorage.getItem('isPreorderPage');
    return value === 'true';
  }

  getToken(): string | null {
    return this.window.localStorage.getItem(this.TOKEN());
  }

  deleteToken() {
    this.window.localStorage.removeItem(this.TOKEN());
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
