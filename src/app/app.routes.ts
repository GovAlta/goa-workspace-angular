import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchComponent } from './pages/search/search.component';
import { CasesComponent } from './pages/cases/cases.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'search', component: SearchComponent },
  { path: 'cases', component: CasesComponent },
];
