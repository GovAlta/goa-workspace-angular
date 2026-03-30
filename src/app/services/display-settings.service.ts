import { Injectable, signal, computed, effect } from '@angular/core';
import {
  LayoutType,
  GroupByField,
  ViewSettings,
} from '../components/display-settings/display-settings.component';

const DEFAULT_VISIBLE_COLUMNS = [
  'name',
  'status',
  'staff',
  'dueDate',
  'jurisdiction',
  'fileNumber',
  'priority',
];

interface StoredSettings {
  viewSettings: ViewSettings;
  layoutCustomized: boolean;
}

function getStorageKey(pageKey: string): string {
  return `${pageKey}-view-settings`;
}

function loadSettings(pageKey: string): StoredSettings | null {
  try {
    const stored = localStorage.getItem(getStorageKey(pageKey));
    if (stored) {
      const parsed = JSON.parse(stored) as StoredSettings;
      if (
        parsed.viewSettings &&
        typeof parsed.viewSettings.layout === 'string' &&
        Array.isArray(parsed.viewSettings.visibleColumns) &&
        typeof parsed.layoutCustomized === 'boolean'
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load view settings from localStorage:', e);
  }
  return null;
}

function saveSettings(pageKey: string, settings: StoredSettings): void {
  try {
    localStorage.setItem(getStorageKey(pageKey), JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save view settings to localStorage:', e);
  }
}

@Injectable()
export class DisplaySettingsService {
  private pageKey = '';
  private getDefaultLayout: (tab: string) => LayoutType = () => 'table';

  private state = signal<StoredSettings>({
    viewSettings: {
      layout: 'table',
      visibleColumns: [...DEFAULT_VISIBLE_COLUMNS],
      groupBy: null,
    },
    layoutCustomized: false,
  });

  viewSettings = computed(() => this.state().viewSettings);
  layoutCustomized = computed(() => this.state().layoutCustomized);

  constructor() {
    effect(() => {
      const current = this.state();
      if (this.pageKey) {
        saveSettings(this.pageKey, current);
      }
    });
  }

  /**
   * Initialize the service with page-specific configuration.
   * Call this once during component init.
   */
  init(options: {
    pageKey: string;
    getDefaultLayout: (tab: string) => LayoutType;
    initialTab: string;
  }): void {
    this.pageKey = options.pageKey;
    this.getDefaultLayout = options.getDefaultLayout;

    const defaultLayout = options.getDefaultLayout(options.initialTab);
    const stored = loadSettings(options.pageKey);

    if (stored) {
      this.state.set(stored);
    } else {
      this.state.set({
        viewSettings: {
          layout: defaultLayout,
          visibleColumns: [...DEFAULT_VISIBLE_COLUMNS],
          groupBy: null,
        },
        layoutCustomized: false,
      });
    }
  }

  setViewSettings(settings: ViewSettings): void {
    this.state.update((prev) => ({
      ...prev,
      viewSettings: settings,
    }));
  }

  setLayoutCustomized(customized: boolean): void {
    this.state.update((prev) => ({
      ...prev,
      layoutCustomized: customized,
    }));
  }

  handleSettingsChange(
    newSettings: ViewSettings,
    currentDefaultLayout: LayoutType,
  ): void {
    this.state.update((prev) => {
      const newLayoutCustomized =
        newSettings.layout !== prev.viewSettings.layout
          ? newSettings.layout !== currentDefaultLayout
          : prev.layoutCustomized;

      return {
        viewSettings: newSettings,
        layoutCustomized: newLayoutCustomized,
      };
    });
  }

  resetSettings(currentDefaultLayout: LayoutType): void {
    this.state.set({
      viewSettings: {
        layout: currentDefaultLayout,
        visibleColumns: [...DEFAULT_VISIBLE_COLUMNS],
        groupBy: null,
      },
      layoutCustomized: false,
    });
  }
}
