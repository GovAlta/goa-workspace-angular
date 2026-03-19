import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  GoabxInput,
  GoabxDropdown,
  GoabxDropdownItem,
  GoabxMenuAction,
  GoabxMenuButton,
} from '@abgov/angular-components';
import {
  GoabIconType,
  GoabInputOnChangeDetail,
  GoabInputOnKeyPressDetail,
  GoabDropdownOnChangeDetail,
  GoabMenuButtonOnActionDetail,
} from '@abgov/ui-components-common';

export type ViewMode = 'table' | 'card' | 'list';

export interface SearchFilters {
  entity: string;
  status: string;
  searchText: string;
}

@Component({
  selector: 'app-search-header-filters',
  imports: [
    GoabxInput,
    GoabxDropdown,
    GoabxDropdownItem,
    GoabxMenuAction,
    GoabxMenuButton,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-header-filters.component.html',
  styleUrl: './search-header-filters.component.css',
})
export class SearchHeaderFiltersComponent {
  @Input({ required: true }) filters!: SearchFilters;
  @Input({ required: true }) statusOptions!: string[];
  @Input({ required: true }) viewMode!: ViewMode;
  @Input({ required: true }) selectedView!: ViewMode;
  @Input() isMobile = false;

  @Output() filtersChange = new EventEmitter<SearchFilters>();
  @Output() searchKeyPress = new EventEmitter<GoabInputOnKeyPressDetail>();
  @Output() viewChange = new EventEmitter<string>();

  onSearchChange(event: GoabInputOnChangeDetail) {
    this.filtersChange.emit({ ...this.filters, searchText: event.value ?? '' });
  }

  onEntityChange(event: GoabDropdownOnChangeDetail) {
    this.filtersChange.emit({ ...this.filters, entity: event.value ?? 'all' });
  }

  onStatusChange(event: GoabDropdownOnChangeDetail) {
    this.filtersChange.emit({ ...this.filters, status: event.value ?? 'all' });
  }

  onSearchKeydown(event: GoabInputOnKeyPressDetail) {
    this.searchKeyPress.emit(event);
  }

  onViewAction(event: GoabMenuButtonOnActionDetail) {
    this.viewChange.emit(event.action);
  }

  getViewLabel(): string {
    switch (this.viewMode) {
      case 'table':
        return 'Table';
      case 'card':
        return 'Card';
      case 'list':
        return 'List';
    }
  }

  getViewIcon(): GoabIconType {
    switch (this.viewMode) {
      case 'table':
        return 'menu';
      case 'card':
        return 'grid';
      case 'list':
        return 'list';
    }
  }
}
