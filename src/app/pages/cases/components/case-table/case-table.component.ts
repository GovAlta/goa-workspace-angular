import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  GoabIcon,
  GoabDataGrid,
  GoabSkeleton,
} from '@abgov/angular-components';
import {
  GoabxTable,
  GoabxTableSortHeader,
  GoabxBadge,
} from '@abgov/angular-components';
import { Case } from '../../../../types/case';
import { SortConfig } from '../../../../utils/search-utils';
import { GroupedCase } from '../../types';
import { ScrollContainerComponent } from '../../../../components/scroll-container/scroll-container.component';

export type ColumnType = 'checkbox' | 'badge' | 'text' | 'link' | 'actions';

export interface TableColumn {
  key: string;
  header?: string;
  headerTemplate?: TemplateRef<unknown>;
  type: ColumnType;
  sortable?: boolean;
  cellTemplate?: TemplateRef<{ $implicit: Case; index: number }>;
}

@Component({
  selector: 'app-case-table',
  imports: [
    NgTemplateOutlet,
    GoabIcon,
    GoabDataGrid,
    GoabSkeleton,
    GoabxTable,
    GoabxTableSortHeader,
    GoabxBadge,
    ScrollContainerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './case-table.component.html',
  styleUrl: './case-table.component.css',
})
export class CaseTableComponent {
  @Input({ required: true }) filteredCases!: Case[];
  @Input() groupedCases: GroupedCase[] | null = null;
  @Input({ required: true }) columns!: TableColumn[];
  @Input() expandedGroups = new Set<string>();
  @Input() isLoading = false;
  @Input() sortConfig: SortConfig = { primary: null, secondary: null };
  @Input() showEmptyState = false;

  @Output() toggleGroup = new EventEmitter<string>();
  @Output() multiSort = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<Case>();

  skeletonRows = Array(10);

  onToggleGroup(groupKey: string) {
    this.toggleGroup.emit(groupKey);
  }

  onMultiSort(event: any) {
    this.multiSort.emit(event);
  }

  onRowClick(caseItem: Case, event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input[type="checkbox"]') ||
      target.closest('goa-checkbox') ||
      target.closest('goa-menu-button') ||
      target.closest('goa-popover')
    ) {
      return;
    }
    this.rowClick.emit(caseItem);
  }

  getCellClassName(type: string): string {
    switch (type) {
      case 'checkbox':
        return 'goa-table-cell--checkbox';
      case 'badge':
        return 'goa-table-cell--badge';
      case 'actions':
        return 'goa-table-cell--actions';
      case 'text':
      case 'link':
      default:
        return 'goa-table-cell--text';
    }
  }

  getColumnSortDirection(columnKey: string): 'asc' | 'desc' | 'none' {
    if (this.sortConfig?.primary?.key === columnKey) {
      return this.sortConfig.primary.direction;
    }
    if (this.sortConfig?.secondary?.key === columnKey) {
      return this.sortConfig.secondary.direction;
    }
    return 'none';
  }

  getColumnSortOrder(columnKey: string): 1 | 2 | undefined {
    if (this.sortConfig?.primary?.key === columnKey) return 1;
    if (this.sortConfig?.secondary?.key === columnKey) return 2;
    return undefined;
  }

  getSkeletonMaxWidth(type: string, rowIndex: number): string {
    switch (type) {
      case 'badge':
        return '80px';
      case 'text':
      case 'link':
      default:
        return `${50 + (rowIndex % 5) * 10}%`;
    }
  }

  isSkeletonThumbnail(type: string): boolean {
    return type === 'checkbox' || type === 'actions';
  }
}
