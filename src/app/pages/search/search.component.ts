import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  GoabBlock,
  GoabDataGrid,
  GoabSkeleton,
  GoabText,
} from '@abgov/angular-components';
import {
  GoabBadge,
  GoabButton,
  GoabLink,
  GoabTable,
  GoabTableSortHeader,
  GoabTableOnMultiSortDetail,
  GoabInputOnKeyPressDetail,
} from '@abgov/angular-components';
import { SearchResult } from '../../types/search-result';
import { filterData, sortData, SortConfig } from '../../utils/search-utils';
import { getTypeBadgeProps } from '../../utils/badge-utils';
import { mockFetch } from '../../utils/mock-api';
import { ViewportService } from '../../services/viewport.service';
import { MultiColumnSortService } from '../../services/multi-column-sort.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  SearchHeaderFiltersComponent,
  SearchFilters,
  ViewMode,
} from './components/search-header-filters/search-header-filters.component';
import { SearchFilterChipsComponent } from './components/search-filter-chips/search-filter-chips.component';
import { SearchCardViewComponent } from './components/search-card-view/search-card-view.component';
import { SearchListViewComponent } from './components/search-list-view/search-list-view.component';
import { ScrollContainerComponent } from '../../components/scroll-container/scroll-container.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import mockData from '../../data/mockSearchResults.json';

@Component({
  selector: 'app-search',
  imports: [
    RouterLink,
    GoabBlock,
    GoabDataGrid,
    GoabSkeleton,
    GoabText,
    GoabBadge,
    GoabButton,
    GoabLink,
    GoabTable,
    GoabTableSortHeader,
    PageHeaderComponent,
    SearchHeaderFiltersComponent,
    SearchFilterChipsComponent,
    SearchCardViewComponent,
    SearchListViewComponent,
    ScrollContainerComponent,
    EmptyStateComponent,
  ],
  providers: [MultiColumnSortService],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  constructor(
    private router: Router,
    public viewport: ViewportService,
    public sortService: MultiColumnSortService,
  ) { }

  searchResults: SearchResult[] = [];
  isLoading = true;
  selectedView: ViewMode = 'table';
  searchChips: string[] = [];
  filters: SearchFilters = { entity: 'all', status: 'all', searchText: '' };

  get viewMode(): ViewMode {
    if (this.viewport.isMobile() && this.selectedView === 'table')
      return 'card';
    return this.selectedView;
  }

  get sortConfig(): SortConfig {
    return this.sortService.sortConfig();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.filters.entity !== 'all') count++;
    if (this.filters.status !== 'all') count++;
    if (this.filters.searchText) count++;
    count += this.searchChips.length;
    return count;
  }

  get statusOptions(): string[] {
    return [...new Set(this.searchResults.map((r) => r.statusText))].sort();
  }

  get filteredResults(): SearchResult[] {
    let filtered = this.searchResults;

    if (this.filters.entity !== 'all') {
      filtered = filtered.filter((r) => r.type === this.filters.entity);
    }
    if (this.filters.status !== 'all') {
      filtered = filtered.filter((r) => r.statusText === this.filters.status);
    }
    if (this.filters.searchText) {
      const searchLower = this.filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.fileNumber.toLowerCase().includes(searchLower) ||
          r.staff.toLowerCase().includes(searchLower),
      );
    }

    filtered = filterData(this.searchChips, filtered);

    return sortData(
      filtered,
      this.sortConfig.primary?.key || null,
      this.sortConfig.primary?.direction || 'none',
      this.sortConfig.secondary?.key || null,
      this.sortConfig.secondary?.direction,
    );
  }

  get showEmptyState(): boolean {
    return this.searchResults.length > 0 && this.activeFiltersCount > 0;
  }

  ngOnInit() {
    this.loadResults();
  }

  private async loadResults() {
    this.isLoading = true;
    this.searchResults = await mockFetch<SearchResult[]>(
      mockData as SearchResult[],
    );
    this.isLoading = false;
  }

  onFiltersChange(filters: SearchFilters) {
    this.filters = filters;
  }

  onSearchKeyPress(event: GoabInputOnKeyPressDetail) {
    if (event.key === 'Enter') {
      const value = event.value.trim();
      if (value && !this.searchChips.includes(value)) {
        this.searchChips = [...this.searchChips, value];
        this.filters = { ...this.filters, searchText: '' };
      }
    }
  }

  onViewChange(action: string) {
    if (action === 'table' || action === 'card' || action === 'list') {
      this.selectedView = action;
    }
  }

  onEntityClear() {
    this.filters = { ...this.filters, entity: 'all' };
  }

  onStatusClear() {
    this.filters = { ...this.filters, status: 'all' };
  }

  onRemoveChip(chip: string) {
    this.searchChips = this.searchChips.filter((c) => c !== chip);
  }

  clearAllFilters() {
    this.searchChips = [];
    this.filters = { entity: 'all', status: 'all', searchText: '' };
    this.sortService.clearSort();
  }

  onMultiSort(detail: GoabTableOnMultiSortDetail) {
    this.sortService.handleMultiSort(detail);
  }

  getColumnSortDirection(key: string): 'asc' | 'desc' | 'none' {
    if (this.sortConfig.primary?.key === key)
      return this.sortConfig.primary.direction;
    if (this.sortConfig.secondary?.key === key)
      return this.sortConfig.secondary.direction;
    return 'none';
  }

  getColumnSortOrder(key: string): 1 | 2 | undefined {
    if (this.sortConfig.primary?.key === key) return 1;
    if (this.sortConfig.secondary?.key === key) return 2;
    return undefined;
  }

  getTypeBadge(type: SearchResult['type']) {
    return getTypeBadgeProps(type);
  }

  onViewResult(id: string) {
    this.router.navigate(['/case', id]);
  }

  skeletonRows = Array(10);
}
