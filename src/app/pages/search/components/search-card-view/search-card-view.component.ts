import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  GoabBlock,
  GoabContainer,
  GoabDataGrid,
  GoabSkeleton,
  GoabText,
} from '@abgov/angular-components';
import { GoabBadge, GoabButton } from '@abgov/angular-components';
import { SearchResult } from '../../../../types/search-result';
import { getTypeBadgeProps } from '../../../../utils/badge-utils';
import { EmptyStateComponent } from '../../../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-search-card-view',
  imports: [
    GoabBlock,
    GoabContainer,
    GoabDataGrid,
    GoabSkeleton,
    GoabText,
    GoabBadge,
    GoabButton,
    EmptyStateComponent,
  ],
  templateUrl: './search-card-view.component.html',
  styleUrl: './search-card-view.component.css',
})
export class SearchCardViewComponent {
  @Input({ required: true }) results!: SearchResult[];
  @Input() isLoading = false;
  @Input() showEmptyState = false;

  @Output() viewResult = new EventEmitter<string>();

  skeletons = Array(6);

  getTypeBadge(type: SearchResult['type']) {
    return getTypeBadgeProps(type);
  }
}
