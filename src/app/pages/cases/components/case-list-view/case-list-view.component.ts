import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  GoabIcon,
  GoabBlock,
  GoabDataGrid,
  GoabIconButton,
  GoabSkeleton,
  GoabBadge,
  GoabLink,
  GoabButton,
} from '@abgov/angular-components';
import { Case } from '../../../../types/case';
import { GroupedCase } from '../../types';
import { EmptyStateComponent } from '../../../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-case-list-view',
  imports: [
    NgTemplateOutlet,
    GoabIcon,
    GoabBlock,
    GoabDataGrid,
    GoabIconButton,
    GoabSkeleton,
    GoabBadge,
    GoabLink,
    GoabButton,
    EmptyStateComponent,
  ],
  templateUrl: './case-list-view.component.html',
  styleUrl: './case-list-view.component.css',
})
export class CaseListViewComponent {
  @Input({ required: true }) filteredCases!: Case[];
  @Input() groupedCases: GroupedCase[] | null = null;
  @Input() expandedGroups = new Set<string>();
  @Input() isLoading = false;
  @Input() showEmptyState = false;
  @Input() emptyStateHeading = 'No results found';
  @Input() emptyStateSubline = 'Try adjusting your search or filters.';

  @Output() toggleGroup = new EventEmitter<string>();
  @Output() menuAction = new EventEmitter<{ action: string; caseId: string }>();

  expandedIds = new Set<string>();
  skeletons = Array(5);

  onToggleGroup(groupKey: string) {
    this.toggleGroup.emit(groupKey);
  }

  onMenuAction(action: string, caseId: string) {
    this.menuAction.emit({ action, caseId });
  }

  toggleExpand(id: string) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  onHeaderClick(event: MouseEvent, id: string) {
    const target = event.target as HTMLElement;
    if (
      target.closest('a') ||
      target.closest('goa-link') ||
      target.closest('button') ||
      target.closest('goa-button') ||
      target.closest('goa-icon-button')
    ) {
      return;
    }
    this.toggleExpand(id);
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'todo':
        return 'To do';
      case 'progress':
        return 'In progress';
      case 'complete':
        return 'Complete';
      default:
        return category || '\u2014';
    }
  }
}
