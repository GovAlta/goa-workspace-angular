import { Injectable, signal } from '@angular/core';
import { SortConfig } from '../utils/search-utils';

@Injectable()
export class MultiColumnSortService {
  sortConfig = signal<SortConfig>({ primary: null, secondary: null });

  handleMultiSort(detail: { name: string; direction: string }) {
    const { name, direction } = detail;

    this.sortConfig.update((prev) => {
      if (direction === 'none') {
        if (prev.primary?.key === name) {
          return { primary: prev.secondary, secondary: null };
        }
        if (prev.secondary?.key === name) {
          return { ...prev, secondary: null };
        }
        return prev;
      }

      const newSort = { key: name, direction: direction as 'asc' | 'desc' };

      if (prev.primary?.key === name) {
        return { ...prev, primary: newSort };
      }
      if (prev.secondary?.key === name) {
        return { ...prev, secondary: newSort };
      }
      if (!prev.primary) {
        return { primary: newSort, secondary: null };
      }
      return { primary: prev.primary, secondary: newSort };
    });
  }

  clearSort() {
    this.sortConfig.set({ primary: null, secondary: null });
  }
}
