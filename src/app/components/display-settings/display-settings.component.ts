import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import {
  GoabPopover,
  GoabIconButton,
  GoabRadioItem,
  GoabIcon,
  GoabButton,
  GoabCheckbox,
  GoabRadioGroup,
  GoabLink,
  GoabRadioGroupOnChangeDetail,
} from '@abgov/angular-components';
import { GoabIconType } from '@abgov/ui-components-common';

export type LayoutType = 'table' | 'card' | 'list';
export type GroupByField =
  | null
  | 'status'
  | 'priority'
  | 'staff'
  | 'jurisdiction';

export interface ViewSettings {
  layout: LayoutType;
  visibleColumns: string[];
  groupBy: GroupByField;
}

type Screen = 'main' | 'layout' | 'columns' | 'grouping';

const COLUMN_OPTIONS = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'staff', label: 'Assigned to' },
  { key: 'dueDate', label: 'Due date' },
  { key: 'jurisdiction', label: 'Jurisdiction' },
  { key: 'fileNumber', label: 'File number' },
  { key: 'priority', label: 'Priority' },
];

const GROUPING_OPTIONS: { value: GroupByField; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'staff', label: 'Assigned to' },
  { value: 'jurisdiction', label: 'Jurisdiction' },
];

const LAYOUT_OPTIONS: {
  value: LayoutType;
  label: string;
  icon: GoabIconType;
}[] = [
  { value: 'table', label: 'Table', icon: 'menu' },
  { value: 'card', label: 'Card', icon: 'grid' },
  { value: 'list', label: 'List', icon: 'list' },
];

@Component({
  selector: 'app-display-settings',
  imports: [
    GoabPopover,
    GoabIconButton,
    GoabRadioItem,
    GoabIcon,
    GoabButton,
    GoabCheckbox,
    GoabRadioGroup,
    GoabLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './display-settings.component.html',
  styleUrl: './display-settings.component.css',
})
export class DisplaySettingsComponent {
  @Input({ required: true }) settings!: ViewSettings;
  @Input({ required: true }) defaultLayout!: LayoutType;
  @Input() isMobile = false;
  @Input() isCompact = false;

  @Output() settingsChange = new EventEmitter<ViewSettings>();

  screen: Screen = 'main';

  readonly columnOptions = COLUMN_OPTIONS;
  readonly groupingOptions = GROUPING_OPTIONS;
  readonly layoutOptions = LAYOUT_OPTIONS;

  get layoutLabel(): string {
    const option = LAYOUT_OPTIONS.find((o) => o.value === this.settings.layout);
    return option?.label || 'Table';
  }

  get groupByLabel(): string {
    const option = GROUPING_OPTIONS.find(
      (o) => o.value === this.settings.groupBy,
    );
    return option?.label || 'None';
  }

  get currentLayoutIcon(): GoabIconType {
    const option = LAYOUT_OPTIONS.find((o) => o.value === this.settings.layout);
    return option?.icon || 'menu';
  }

  handleLayoutChange(event: GoabRadioGroupOnChangeDetail): void {
    this.settingsChange.emit({
      ...this.settings,
      layout: event.value as LayoutType,
    });
  }

  handleColumnToggle(columnKey: string): void {
    const newColumns = this.settings.visibleColumns.includes(columnKey)
      ? this.settings.visibleColumns.filter((c) => c !== columnKey)
      : [...this.settings.visibleColumns, columnKey];

    // Ensure at least one column remains visible
    if (newColumns.length === 0) return;

    this.settingsChange.emit({
      ...this.settings,
      visibleColumns: newColumns,
    });
  }

  handleGroupByChange(event: GoabRadioGroupOnChangeDetail): void {
    this.settingsChange.emit({
      ...this.settings,
      groupBy: event.value === 'null' ? null : (event.value as GroupByField),
    });
  }

  handleReset(): void {
    this.settingsChange.emit({
      layout: this.defaultLayout,
      visibleColumns: COLUMN_OPTIONS.map((c) => c.key),
      groupBy: null,
    });
  }

  navigateTo(target: Screen): void {
    this.screen = target;
  }

  getRadioGroupValue(): string {
    return this.settings.groupBy === null ? 'null' : this.settings.groupBy;
  }

  getGroupingOptionValue(value: GroupByField): string {
    return value === null ? 'null' : value;
  }

  getLayoutRadioLabel(option: { value: LayoutType; label: string }): string {
    return option.value === this.defaultLayout
      ? `${option.label} (Default)`
      : option.label;
  }

  isColumnChecked(key: string): boolean {
    return this.settings.visibleColumns.includes(key);
  }

  isColumnDisabled(key: string): boolean {
    return (
      this.settings.visibleColumns.length === 1 &&
      this.settings.visibleColumns.includes(key)
    );
  }

  onResetClick(event: Event): void {
    event.preventDefault();
    this.handleReset();
  }
}
