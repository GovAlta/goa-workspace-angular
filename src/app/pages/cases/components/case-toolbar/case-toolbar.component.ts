import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  GoabIconButton,
  GoabTab,
  GoabTabs,
  GoabBadge,
  GoabFormItem,
  GoabInput,
  GoabButton,
  GoabMenuButton,
  GoabMenuAction,
} from '@abgov/angular-components';
import {
  GoabIconType,
  GoabTabsOnChangeDetail,
  GoabInputOnChangeDetail,
  GoabInputOnKeyPressDetail,
  GoabMenuButtonOnActionDetail,
} from '@abgov/ui-components-common';
import { DisplaySettingsComponent } from '../../../../components/display-settings/display-settings.component';
import {
  ViewSettings,
  LayoutType,
} from '../../../../components/display-settings/display-settings.component';
import { SortConfig } from '../../../../utils/search-utils';
import { SORT_FIELD_LABELS } from '../../types';

const VALID_TABS = ['all', 'unassigned', 'todo', 'progress', 'complete'];

@Component({
  selector: 'app-case-toolbar',
  imports: [
    GoabIconButton,
    GoabTab,
    GoabTabs,
    GoabBadge,
    GoabFormItem,
    GoabInput,
    GoabButton,
    GoabMenuButton,
    GoabMenuAction,
    DisplaySettingsComponent,
  ],
  templateUrl: './case-toolbar.component.html',
  styleUrl: './case-toolbar.component.css',
})
export class CaseToolbarComponent {
  @Input({ required: true }) activeTab!: string;
  @Input({ required: true }) totalCount!: number;
  @Input({ required: true }) unassignedCount!: number;
  @Input({ required: true }) myCasesCount!: number;
  @Input({ required: true }) inProgressCount!: number;
  @Input({ required: true }) inputValue!: string;
  @Input({ required: true }) inputError!: string;
  @Input({ required: true }) sortConfig!: SortConfig;
  @Input({ required: true }) viewSettings!: ViewSettings;
  @Input({ required: true }) defaultLayout!: LayoutType;
  @Input() isMobile = false;
  @Input() isCompactToolbar = false;

  @Output() tabChange = new EventEmitter<GoabTabsOnChangeDetail>();
  @Output() inputChange = new EventEmitter<string>();
  @Output() inputKeyPress = new EventEmitter<GoabInputOnKeyPressDetail>();
  @Output() sortAction = new EventEmitter<string>();
  @Output() settingsChange = new EventEmitter<ViewSettings>();
  @Output() filterOpen = new EventEmitter<void>();

  readonly VALID_TABS = VALID_TABS;
  readonly sortFieldEntries = Object.entries(SORT_FIELD_LABELS);

  get initialTab(): number {
    return VALID_TABS.indexOf(this.activeTab) + 1;
  }

  getSortIndicator(key: string): string {
    if (this.sortConfig.primary?.key === key) {
      const arrow = this.sortConfig.primary.direction === 'asc' ? '↑' : '↓';
      return this.sortConfig.secondary ? ` (1st ${arrow})` : ` ${arrow}`;
    }
    if (this.sortConfig.secondary?.key === key) {
      const arrow = this.sortConfig.secondary.direction === 'asc' ? '↑' : '↓';
      return ` (2nd ${arrow})`;
    }
    return '';
  }

  getSortIcon(key: string): GoabIconType | undefined {
    if (this.sortConfig.primary?.key === key && !this.sortConfig.secondary) {
      return 'checkmark';
    }
    return undefined;
  }

  getSortMenuText(key: string, label: string): string {
    return `${label}${this.getSortIndicator(key)}`;
  }

  get sortLeadingIcon(): GoabIconType | undefined {
    return this.isCompactToolbar ? 'swap-vertical' : undefined;
  }

  get sortButtonText(): string | undefined {
    return this.isCompactToolbar ? undefined : 'Sort';
  }

  onInputChange(event: GoabInputOnChangeDetail) {
    this.inputChange.emit(event.value ?? '');
  }

  onInputKeyPress(event: GoabInputOnKeyPressDetail) {
    this.inputKeyPress.emit(event);
  }

  onSortAction(event: GoabMenuButtonOnActionDetail) {
    this.sortAction.emit(event.action);
  }

  onFilterOpen() {
    this.filterOpen.emit();
  }

  onTabChange(event: GoabTabsOnChangeDetail) {
    this.tabChange.emit(event);
  }

  onSettingsChange(settings: ViewSettings) {
    this.settingsChange.emit(settings);
  }
}
