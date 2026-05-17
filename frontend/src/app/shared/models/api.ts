import { HttpHeaders } from '@angular/common/http';

export const SURVEY_BASE_URL = 'http://localhost:8080/api/v1/';

export enum API_ENDPOINTS {
    // Auth
    AUTH_REGISTER = 'auth/register',
    AUTH_LOGIN = 'auth/login',
    AUTH_REFRESH = 'auth/refresh',

    // Surveys — public read
    SURVEYS = 'surveys',
    SURVEYS_HOME = 'surveys/home',

    // Surveys — my (authenticated user)
    MY_SURVEYS = 'surveys/my',

    // Survey responses & stats (base, urlId appended by helper)
    SURVEY_RESPONSES = 'surveys',

    // Surveys — admin
    ADMIN_SURVEYS = 'surveys/admin',

    // Users
    USERS = 'users',
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
