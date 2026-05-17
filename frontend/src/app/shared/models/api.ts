import { HttpHeaders } from '@angular/common/http';

export const BASE_URL = 'https://exx3be8tel.execute-api.eu-west-2.amazonaws.com/dev/';
export const NEW_BASE_URL = 'https://run16-team2-api-handler-run16-team2-run16-team2-dev.development.krci-dev.cloudmentor.academy/';
export const SURVEY_BASE_URL = 'http://localhost:8080/api/v1/';

/* export const BASE_URL = 'http://127.0.0.1:8000/';
export const NEW_BASE_URL = 'http://127.0.0.1:8000/'; */

export enum API_ENDPOINTS {
    AUTH_REGISTER = 'auth/register',
    AUTH_LOGIN = 'auth/login',
    AUTH_REFRESH = 'auth/refresh',
}

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    })
};

export function getAuthOptions(token: string) {
    const trimmedToken = token.trim();
    const value = trimmedToken.startsWith('Bearer ') ? trimmedToken : `Bearer ${trimmedToken}`;
    return {
      headers: httpOptions.headers.set('Authorization', value),
    };
  }
