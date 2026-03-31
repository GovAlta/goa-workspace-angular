import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  GoabButtonGroup,
  GoabDivider,
  GoabPushDrawer,
  GoabButton,
  GoabFormItem,
  GoabCheckbox,
} from '@abgov/angular-components';
import { FilterState, FilterOptions } from '../../types';

@Component({
  selector: 'app-case-filter-drawer',
  imports: [
    GoabButtonGroup,
    GoabDivider,
    GoabPushDrawer,
    GoabButton,
    GoabFormItem,
    GoabCheckbox,
  ],
  templateUrl: './case-filter-drawer.component.html',
  styleUrl: './case-filter-drawer.component.css',
})
export class CaseFilterDrawerComponent {
  @Input() open = false;
  @Input({ required: true }) pendingFilters!: FilterState;
  @Input({ required: true }) filterOptions!: FilterOptions;

  @Output() close = new EventEmitter<void>();
  @Output() toggleFilter = new EventEmitter<{
    category: keyof FilterState;
    value: string;
  }>();
  @Output() apply = new EventEmitter<void>();
  @Output() clearAll = new EventEmitter<void>();

  get hasFilters(): boolean {
    return Object.values(this.pendingFilters).some((arr) => arr.length > 0);
  }

  onToggleFilter(category: keyof FilterState, value: string) {
    this.toggleFilter.emit({ category, value });
  }

  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  onClose() {
    this.close.emit();
  }

  onApply() {
    this.apply.emit();
  }

  onClearAll() {
    this.clearAll.emit();
  }
}
