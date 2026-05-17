import { HttpHeaders } from '@angular/common/http';

export const BASE_URL = 'https://exx3be8tel.execute-api.eu-west-2.amazonaws.com/dev/';
export const NEW_BASE_URL = 'https://run16-team2-api-handler-run16-team2-run16-team2-dev.development.krci-dev.cloudmentor.academy/';

/* export const BASE_URL = 'http://127.0.0.1:8000/';
export const NEW_BASE_URL = 'http://127.0.0.1:8000/'; */

export enum API_ENDPOINTS {
    AUTH_SIGN_UP = 'auth/sign-up',
    AUTH_SIGN_IN = 'auth/sign-in',
    AUTH_SIGN_OUT = 'auth/sign-out',
    PASSWORD_RESET_REQUEST = 'auth/forgot-password',
    VERIFY_TOKEN = 'auth/reset-password/verify-token',
    RESET_PASSWORD = 'auth/reset-password',
    VERIFY_CODE = 'auth/verify-code',
    VERIFY_CODE_REGISTRATION = 'auth/sign-up/verify',
    RESEND_VERIFICATION_CODE = 'auth/sign-up/resend-verification-code',
    GET_CAPTCHA = 'auth/captcha',
    REFRESH_TOKEN = 'auth/refresh',
    GET_AVAILABLE_TABLES = 'bookings/tables',
    MAKE_RESERVATION_WAITER = 'bookings/waiter',
    GET_ALL_DISHES = 'dishes',
    GET_POPULAR_DISHES = 'dishes/popular',
    GET_AVAILABLE_DISHES = 'available-dishes',
    GET_ALL_LOCATIONS = 'locations',
    LOCATION_SELECT_OPTIONS = 'locations/select-options',
    MAKE_RESERVATION = 'bookings/client',
    GET_ALL_RESERVATIONS = 'reservations',
    GET_ALL_CUSTOMERS = 'customers',
    FEEDBACKS = 'feedbacks',
    GET_ANONYMOUS_FEEDBACK = 'feedbacks/visitor/info',
    PROFILE = 'users/profile',
    CHANGE_PASSWORD = 'users/profile/change-password',
    CHANGE_USER_EMAIL = 'users/profile/change-email/initiate',
    VERIFY_EMAIL_VERIFICATION_CODE = 'users/profile/change-email/verify',
    VERIFY_EMAIL_VERIFICATION_TOKEN = 'users/profile/change-email/verify-token',
    GET_ALL_STAFF = 'waiters',
    GET_ARCHIVED_STAFF = 'waiters/archived',
    ADD_NEW_STAFF = 'waiters/add_waiter',
    REPORTS = 'reports',
    WEEKLY_REPORTS = 'reports/trigger-weekly-stats',
    DISH_ORDER = 'order',
    GET_CART_DISHES = 'cart',
    GET_NOTIFICATIONS = 'notifications',
    MARK_NOTIFICATIONS_AS_READ = 'notifications/mark-as-read',
/*     SOCIAL_LOGIN_WITH_GOOGLE = 'oauth/login/google',
    SOCIAL_LOGIN_WITH_FACEBOOK = 'oauth/login/facebook',
    SOCIAL_CALLBACK_GOOGLE = 'oauth/callback/google',
    SOCIAL_CALLBACK_FACEBOOK = 'oauth/callback/facebook',
    SOCIAL_STATUS = 'oauth/status',
    SOCIAL_LOGOUT = 'oauth/logout', */
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
