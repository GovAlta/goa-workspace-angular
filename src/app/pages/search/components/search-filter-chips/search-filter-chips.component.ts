import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoabIcon, GoabFilterChip } from '@abgov/angular-components';

@Component({
  selector: 'app-search-filter-chips',
  imports: [GoabIcon, GoabFilterChip],
  templateUrl: './search-filter-chips.component.html',
  styleUrl: './search-filter-chips.component.css',
})
export class SearchFilterChipsComponent {
  @Input({ required: true }) entityFilter!: string;
  @Input({ required: true }) statusFilter!: string;
  @Input({ required: true }) searchChips!: string[];

  @Output() entityClear = new EventEmitter<void>();
  @Output() statusClear = new EventEmitter<void>();
  @Output() removeChip = new EventEmitter<string>();
  @Output() clearAll = new EventEmitter<void>();

  get hasActiveFilters(): boolean {
    return (
      this.searchChips.length > 0 ||
      this.entityFilter !== 'all' ||
      this.statusFilter !== 'all'
    );
  }

  getEntityLabel(): string {
    switch (this.entityFilter) {
      case 'client':
        return 'Clients';
      case 'case':
        return 'Cases';
      case 'application':
        return 'Applications';
      case 'document':
        return 'Documents';
      default:
        return this.entityFilter;
    }
  }

  onClearAll(event: Event) {
    event.preventDefault();
    this.clearAll.emit();
  }
}
