import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoabxWorkSideMenu,
  GoabxWorkSideMenuItem,
} from '@abgov/angular-components';
import { ViewportService } from './services/viewport.service';
import { WorkspaceLayoutComponent } from './components/workspace-layout/workspace-layout.component';

@Component({
  selector: 'app-root',
  imports: [GoabxWorkSideMenu, GoabxWorkSideMenuItem, WorkspaceLayoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  viewport = inject(ViewportService);
  private router = inject(Router);

  onNavigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
