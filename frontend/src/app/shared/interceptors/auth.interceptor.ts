import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/local-storage/local-storage';

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => req.url.includes(endpoint));
  if (isAuthEndpoint) {
    return next(req);
  }

  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
