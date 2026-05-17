import { Routes } from '@angular/router';
import { ROUTES } from './shared/models/routes.constants';
import { nonAuthorizedGuard } from './shared/guards/non-authorized/non-authorized.guard';
import { authorizedGuard } from './shared/guards/authorized/authorized.guard';
import { adminGuard } from './shared/guards/admin/admin.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: ROUTES.MAIN_PAGE,
		pathMatch: 'full',
	},
	{
		path: ROUTES.LOGIN,
		canActivate: [nonAuthorizedGuard],
		loadComponent: () =>
			import('./feature/login-page/login-page').then((m) => m.LoginPage),
	},
	{
		path: ROUTES.REGISTER,
		canActivate: [nonAuthorizedGuard],
		loadComponent: () =>
			import('./feature/registration-page/registration-page').then(
				(m) => m.RegistrationPage
			),
	},
	{
		path: ROUTES.MAIN_PAGE,
		loadComponent: () =>
			import('./feature/main-page/main-page').then((m) => m.MainPage),
	},
	{
		path: ROUTES.USER_PROFILE,
		canActivate: [authorizedGuard],
		loadComponent: () =>
			import('./feature/user-profile/user-profile').then((m) => m.UserProfile),
	},
	{
		path: ROUTES.SURVEYS,
		loadComponent: () =>
			import('./feature/surveys-page/surveys-page').then((m) => m.SurveysPage),
	},
	{
		path: ROUTES.SURVEY_DETAIL,
		loadComponent: () =>
			import('./feature/survey-detail/survey-detail').then((m) => m.SurveyDetail),
	},
	{
		path: ROUTES.ABOUT,
		loadComponent: () =>
			import('./feature/about-page/about-page').then((m) => m.AboutPage),
	},
	{
		path: ROUTES.STATISTICS,
		canActivate: [adminGuard],
		loadComponent: () =>
			import('./feature/admin-stats/admin-stats').then((m) => m.AdminStats),
	},
	{
		path: ROUTES.ADMIN_USERS,
		canActivate: [adminGuard],
		loadComponent: () =>
			import('./feature/admin-users/admin-users').then((m) => m.AdminUsers),
	},
	{
		path: ROUTES.ADMIN_SURVEYS,
		canActivate: [adminGuard],
		loadComponent: () =>
			import('./feature/admin-surveys/admin-surveys').then((m) => m.AdminSurveys),
	},
	{
		path: ROUTES.USER_SURVEYS,
		canActivate: [authorizedGuard],
		loadComponent: () =>
			import('./feature/my-surveys/my-surveys').then((m) => m.MySurveys),
	},
	{
		path: ROUTES.CONTACT,
		loadComponent: () =>
			import('./feature/contact-page/contact-page').then((m) => m.ContactPage),
	},
	{
		path: '**',
		redirectTo: ROUTES.MAIN_PAGE,
	},
];
