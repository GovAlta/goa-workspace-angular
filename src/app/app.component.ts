import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoabWorkSideMenu,
  GoabWorkSideMenuGroup,
  GoabWorkSideMenuItem,
  GoabWorkSideNotificationPanel,
  GoabWorkSideNotificationItem,
} from '@abgov/angular-components';
import { ViewportService } from './services/viewport.service';
import { NotificationService } from './services/notification.service';
import { WorkspaceLayoutComponent } from './components/workspace-layout/workspace-layout.component';

@Component({
  selector: 'app-root',
  imports: [
    GoabWorkSideMenu,
    GoabWorkSideMenuGroup,
    GoabWorkSideMenuItem,
    GoabWorkSideNotificationPanel,
    GoabWorkSideNotificationItem,
    WorkspaceLayoutComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    public viewport: ViewportService,
    public notifications: NotificationService,
    private router: Router,
  ) {}

  onNavigate(url: string) {
    this.router.navigateByUrl(url);
  }

  onViewAllNotifications() {
    this.router.navigateByUrl('/notifications');
  }

  onNotificationClick(id: string) {
    this.notifications.markAsRead(id);
  }
}
