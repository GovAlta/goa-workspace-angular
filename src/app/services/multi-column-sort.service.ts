import { Injectable, signal } from '@angular/core';
import { GoabTableOnMultiSortDetail } from '@abgov/ui-components-common';
import { SortConfig } from '../utils/search-utils';

@Injectable()
export class MultiColumnSortService {
  sortConfig = signal<SortConfig>({ primary: null, secondary: null });

  handleMultiSort(detail: GoabTableOnMultiSortDetail) {
    const sorts = detail.sorts;

    const primary = sorts[0]
      ? { key: sorts[0].column, direction: sorts[0].direction as 'asc' | 'desc' }
      : null;
    const secondary = sorts[1]
      ? { key: sorts[1].column, direction: sorts[1].direction as 'asc' | 'desc' }
      : null;

    this.sortConfig.set({ primary, secondary });
  }

  clearSort() {
    this.sortConfig.set({ primary: null, secondary: null });
  }
}
