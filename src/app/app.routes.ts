import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'case/:id',
    loadComponent: () =>
      import('./pages/cases/case-detail/case-detail.component').then(
        (m) => m.CaseDetailComponent,
      ),
  },
  {
    path: 'cases',
    loadComponent: () =>
      import('./pages/cases/cases.component').then((m) => m.CasesComponent),
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./pages/schedule/schedule.component').then(
        (m) => m.ScheduleComponent,
      ),
  },
  {
    path: 'documents',
    redirectTo: 'documents/sub1',
    pathMatch: 'full',
  },
  {
    path: 'documents/sub1',
    loadComponent: () =>
      import('./pages/documents/sub-menu-1.component').then(
        (m) => m.SubMenu1Component,
      ),
  },
  {
    path: 'documents/sub2',
    loadComponent: () =>
      import('./pages/documents/sub-menu-2.component').then(
        (m) => m.SubMenu2Component,
      ),
  },
  {
    path: 'documents/sub3',
    loadComponent: () =>
      import('./pages/documents/sub-menu-3.component').then(
        (m) => m.SubMenu3Component,
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./pages/team/team.component').then((m) => m.TeamComponent),
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./pages/support/support.component').then(
        (m) => m.SupportComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account.component').then(
        (m) => m.AccountComponent,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then(
        (m) => m.NotificationsComponent,
      ),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./pages/logout/logout.component').then((m) => m.LogoutComponent),
  },
  {
    path: '401',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent,
      ),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./pages/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
