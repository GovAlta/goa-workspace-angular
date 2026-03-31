import { Component, ChangeDetectorRef } from '@angular/core';
import {
  GoabTab,
  GoabTabs,
  GoabBadge,
  GoabButton,
  GoabWorkSideNotificationItem,
  GoabTabsOnChangeDetail,
} from '@abgov/angular-components';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import {
  NotificationService,
  AppNotification,
} from '../../services/notification.service';

type TabSlug = 'unread' | 'urgent' | 'all';
const TAB_SLUGS: TabSlug[] = ['unread', 'urgent', 'all'];

interface NotificationGroup {
  label: string;
  items: AppNotification[];
}

function groupByDate(items: AppNotification[]): NotificationGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const map = new Map<string, AppNotification[]>();

  for (const item of items) {
    const d = new Date(item.timestamp);
    const itemDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let key: string;
    if (itemDate.getTime() === today.getTime()) {
      key = 'Today';
    } else if (itemDate.getTime() === yesterday.getTime()) {
      key = 'Yesterday';
    } else {
      key = itemDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  }

  const groups: NotificationGroup[] = [];
  for (const [label, items] of map) {
    groups.push({ label, items });
  }
  return groups;
}

@Component({
  selector: 'app-notifications',
  imports: [
    GoabTab,
    GoabTabs,
    GoabBadge,
    GoabButton,
    GoabWorkSideNotificationItem,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  constructor(
    public notifications: NotificationService,
    private cdr: ChangeDetectorRef,
  ) { }

  activeTab: TabSlug = 'unread';

  get tabIndex(): number {
    return TAB_SLUGS.indexOf(this.activeTab) + 1;
  }

  get urgentCount(): number {
    return this.notifications
      .allNotifications()
      .filter((n) => n.priority === 'urgent').length;
  }

  get filteredNotifications(): AppNotification[] {
    const all = this.notifications.allNotifications();
    switch (this.activeTab) {
      case 'unread':
        return all.filter((n) => n.readStatus === 'unread');
      case 'urgent':
        return all.filter((n) => n.priority === 'urgent');
      case 'all':
        return all;
    }
  }

  get groups(): NotificationGroup[] {
    return groupByDate(this.filteredNotifications);
  }

  get emptyMessage(): string {
    switch (this.activeTab) {
      case 'unread':
        return 'No unread notifications';
      case 'urgent':
        return 'No urgent notifications';
      case 'all':
        return 'No notifications';
    }
  }

  handleTabChange(event: GoabTabsOnChangeDetail) {
    const slug = TAB_SLUGS[event.tab - 1];
    if (slug) {
      this.activeTab = slug;
      this.cdr.detectChanges();
    }
  }

  onNotificationClick(id: string) {
    this.notifications.markAsRead(id);
    this.cdr.detectChanges();
  }

  onMarkAllAsRead() {
    this.notifications.markAllAsRead();
    this.cdr.detectChanges();
  }
}
