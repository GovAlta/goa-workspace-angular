import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoabIcon, GoabFilterChip, GoabLink } from '@abgov/angular-components';
import { FilterChip } from '../../types';

@Component({
  selector: 'app-case-filter-chips',
  imports: [GoabIcon, GoabFilterChip, GoabLink],
  templateUrl: './case-filter-chips.component.html',
  styleUrl: './case-filter-chips.component.css',
})
export class CaseFilterChipsComponent {
  @Input({ required: true }) searchChips!: string[];
  @Input({ required: true }) filterChips!: FilterChip[];

  @Output() removeSearchChip = new EventEmitter<string>();
  @Output() removeFilter = new EventEmitter<{
    category: string;
    value: string;
  }>();
  @Output() clearAll = new EventEmitter<void>();

  get hasChips(): boolean {
    return this.searchChips.length > 0 || this.filterChips.length > 0;
  }

  onRemoveFilter(category: string, value: string) {
    this.removeFilter.emit({ category, value });
  }

  onClearAll(event: Event) {
    event.preventDefault();
    this.clearAll.emit();
  }
}
