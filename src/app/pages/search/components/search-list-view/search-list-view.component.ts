import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import {
  GoabBlock,
  GoabDataGrid,
  GoabIconButton,
  GoabSkeleton,
} from '@abgov/angular-components';
import { GoabxBadge, GoabxButton } from '@abgov/angular-components';
import { SearchResult } from '../../../../types/search-result';
import { getTypeBadgeProps } from '../../../../utils/badge-utils';
import { EmptyStateComponent } from '../../../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-search-list-view',
  imports: [
    GoabBlock,
    GoabDataGrid,
    GoabIconButton,
    GoabSkeleton,
    GoabxBadge,
    GoabxButton,
    EmptyStateComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-list-view.component.html',
  styleUrl: './search-list-view.component.css',
})
export class SearchListViewComponent {
  @Input({ required: true }) results!: SearchResult[];
  @Input() isLoading = false;
  @Input() showEmptyState = false;

  expandedIds = new Set<string>();
  skeletons = Array(8);

  toggle(id: string) {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  getTypeBadge(type: SearchResult['type']) {
    return getTypeBadgeProps(type);
  }
}
