import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  GoabButtonGroup,
  GoabContainer,
  GoabBlock,
  GoabSkeleton,
  GoabDataGrid,
  GoabIcon,
} from '@abgov/angular-components';
import {
  GoabxButton,
  GoabxCheckbox,
  GoabxBadge,
  GoabxMenuButton,
  GoabxMenuAction,
  GoabxLink,
} from '@abgov/angular-components';
import { Case } from '../../types/case';
import { Comments } from '../../types/comments';
import { filterData, sortData } from '../../utils/search-utils';
import { getPriorityBadgeProps } from '../../utils/badge-utils';
import { mockFetch } from '../../utils/mock-api';
import { ViewportService } from '../../services/viewport.service';
import { MultiColumnSortService } from '../../services/multi-column-sort.service';
import { DisplaySettingsService } from '../../services/display-settings.service';
import { PageFooterService } from '../../services/page-footer.service';
import {
  LayoutType,
  ViewSettings,
} from '../../components/display-settings/display-settings.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { CommentsDrawerComponent } from '../../components/comments-drawer/comments-drawer.component';
import { CaseToolbarComponent } from './components/case-toolbar/case-toolbar.component';
import { CaseFilterChipsComponent } from './components/case-filter-chips/case-filter-chips.component';
import {
  CaseTableComponent,
  TableColumn,
} from './components/case-table/case-table.component';
import { CaseListViewComponent } from './components/case-list-view/case-list-view.component';
import { CaseCardComponent } from './components/case-card/case-card.component';
import { CaseDeleteModalComponent } from './components/case-delete-modal/case-delete-modal.component';
import { CaseFilterDrawerComponent } from './components/case-filter-drawer/case-filter-drawer.component';
import { FilterState, FilterChip, FilterOptions, GroupedCase } from './types';

import mockData from '../../data/mockCases.json';
import mockComments from '../../data/mockComments.json';

type ViewMode = 'table' | 'card' | 'list';

const COMPACT_TOOLBAR_BREAKPOINT = 768;

@Component({
  selector: 'app-cases',
  imports: [
    RouterLink,
    GoabButtonGroup,
    GoabContainer,
    GoabBlock,
    GoabSkeleton,
    GoabDataGrid,
    GoabIcon,
    GoabxButton,
    GoabxCheckbox,
    GoabxBadge,
    GoabxMenuButton,
    GoabxMenuAction,
    GoabxLink,
    PageHeaderComponent,
    EmptyStateComponent,
    CommentsDrawerComponent,
    CaseToolbarComponent,
    CaseFilterChipsComponent,
    CaseTableComponent,
    CaseListViewComponent,
    CaseCardComponent,
    CaseDeleteModalComponent,
    CaseFilterDrawerComponent,
  ],
  providers: [MultiColumnSortService, DisplaySettingsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.css',
})
export class CasesComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private viewport = inject(ViewportService);
  private sortService = inject(MultiColumnSortService);
  private displayService = inject(DisplaySettingsService);
  private footerService = inject(PageFooterService);

  @ViewChild('footerTemplate', { static: true })
  footerTemplate!: TemplateRef<unknown>;

  // Column template refs
  @ViewChild('selectAllHeader', { static: true })
  selectAllHeaderTpl!: TemplateRef<unknown>;
  @ViewChild('selectCell', { static: true })
  selectCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('nameCell', { static: true })
  nameCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('statusCell', { static: true })
  statusCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('staffCell', { static: true })
  staffCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('dueDateCell', { static: true })
  dueDateCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('jurisdictionCell', { static: true })
  jurisdictionCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('fileNumberCell', { static: true })
  fileNumberCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('priorityCell', { static: true })
  priorityCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;
  @ViewChild('actionsCell', { static: true })
  actionsCellTpl!: TemplateRef<{ $implicit: Case; index: number }>;

  // State
  activeTab = 'all';
  inputValue = '';
  inputError = '';
  typedChips: string[] = [];
  cases: Case[] = [];
  isLoading = true;
  filterDrawerOpen = false;
  showDeleteModal = false;
  caseToDelete: string | null = null;
  isCommentsDrawerOpen = false;
  comments: Comments[] = [];
  selectedCaseIdForComments: string | null = null;
  expandedGroups = new Set<string>();

  pendingFilters: FilterState = {
    status: [],
    priority: [],
    jurisdiction: [],
    staff: [],
  };

  appliedFilters: FilterState = {
    status: [],
    priority: [],
    jurisdiction: [],
    staff: [],
  };

  isCompactToolbar = signal(window.innerWidth < COMPACT_TOOLBAR_BREAKPOINT);
  private resizeHandler = () => {
    this.isCompactToolbar.set(window.innerWidth < COMPACT_TOOLBAR_BREAKPOINT);
  };

  // Computed: isMobile
  get isMobile(): boolean {
    return this.viewport.isMobile();
  }

  // Computed: sortConfig
  get sortConfig() {
    return this.sortService.sortConfig();
  }

  // Computed: viewSettings
  get viewSettings(): ViewSettings {
    return this.displayService.viewSettings();
  }

  // Computed: layoutCustomized
  get layoutCustomized(): boolean {
    return this.displayService.layoutCustomized();
  }

  // Computed: defaultLayout
  get defaultLayout(): LayoutType {
    return this.getDefaultLayout(this.activeTab);
  }

  // Computed: viewMode
  get viewMode(): ViewMode {
    const layout = this.viewSettings?.layout || 'table';
    if (this.isMobile && layout === 'table') return 'card';
    if (layout !== 'table' && layout !== 'card' && layout !== 'list')
      return 'table';
    return layout;
  }

  // Computed: filterOptions
  get filterOptions(): FilterOptions {
    const statuses = [...new Set(this.cases.map((c) => c.statusText))].sort();
    const priorities = ['high', 'medium', 'low'];
    const jurisdictions = [
      ...new Set(this.cases.map((c) => c.jurisdiction)),
    ].sort();
    const staffMembers = [...new Set(this.cases.map((c) => c.staff))].sort();
    return { statuses, priorities, jurisdictions, staffMembers };
  }

  // Computed: filteredCases
  get filteredCases(): Case[] {
    let filtered = this.cases;

    if (this.activeTab === 'unassigned') {
      filtered = this.cases.filter(
        (caseItem) => !caseItem.staff || caseItem.staff === '',
      );
    } else if (this.activeTab !== 'all') {
      filtered = this.cases.filter(
        (caseItem) => caseItem.category === this.activeTab,
      );
    }

    filtered = filterData(this.typedChips, filtered);

    if (this.appliedFilters.status.length > 0) {
      filtered = filtered.filter((c) =>
        this.appliedFilters.status.includes(c.statusText),
      );
    }
    if (this.appliedFilters.priority.length > 0) {
      filtered = filtered.filter((c) =>
        this.appliedFilters.priority.includes(c.priority),
      );
    }
    if (this.appliedFilters.jurisdiction.length > 0) {
      filtered = filtered.filter((c) =>
        this.appliedFilters.jurisdiction.includes(c.jurisdiction),
      );
    }
    if (this.appliedFilters.staff.length > 0) {
      filtered = filtered.filter((c) =>
        this.appliedFilters.staff.includes(c.staff),
      );
    }

    const sc = this.sortConfig;
    return sortData(
      filtered,
      sc.primary?.key || null,
      sc.primary?.direction || 'none',
      sc.secondary?.key || null,
      sc.secondary?.direction,
    );
  }

  // Computed: groupedCases
  get groupedCases(): GroupedCase[] | null {
    if (!this.viewSettings.groupBy) return null;

    const groupMap = new Map<string, Case[]>();

    this.filteredCases.forEach((caseItem) => {
      let groupKey: string;
      switch (this.viewSettings.groupBy) {
        case 'status':
          groupKey = caseItem.statusText || 'Unknown';
          break;
        case 'priority':
          groupKey = caseItem.priority || 'None';
          break;
        case 'staff':
          groupKey = caseItem.staff || 'Unassigned';
          break;
        case 'jurisdiction':
          groupKey = caseItem.jurisdiction || 'Unknown';
          break;
        default:
          groupKey = 'Unknown';
      }

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(caseItem);
    });

    const groups: GroupedCase[] = [];
    groupMap.forEach((cases, key) => {
      groups.push({ key, label: key, cases });
    });

    return groups;
  }

  // Computed: filterChips
  get filterChips(): FilterChip[] {
    const chips: FilterChip[] = [];
    this.appliedFilters.status.forEach((v) =>
      chips.push({ category: 'status', value: v, label: v }),
    );
    this.appliedFilters.priority.forEach((v) =>
      chips.push({
        category: 'priority',
        value: v,
        label: v.charAt(0).toUpperCase() + v.slice(1) + ' priority',
      }),
    );
    this.appliedFilters.staff.forEach((v) =>
      chips.push({ category: 'staff', value: v, label: v }),
    );
    this.appliedFilters.jurisdiction.forEach((v) =>
      chips.push({ category: 'jurisdiction', value: v, label: v }),
    );
    return chips;
  }

  // Computed: selectedCount
  get selectedCount(): number {
    return this.filteredCases.filter((c) => c.selected).length;
  }

  // Computed: isAllSelected
  get isAllSelected(): boolean {
    return (
      this.selectedCount > 0 && this.selectedCount === this.filteredCases.length
    );
  }

  // Computed: isIndeterminate
  get isIndeterminate(): boolean {
    return (
      this.selectedCount > 0 && this.selectedCount < this.filteredCases.length
    );
  }

  // Computed: myCasesCount
  get myCasesCount(): number {
    return this.cases.filter((c) => c.category === 'todo').length;
  }

  // Computed: inProgressCount
  get inProgressCount(): number {
    return this.cases.filter((c) => c.category === 'progress').length;
  }

  // Computed: unassignedCount
  get unassignedCount(): number {
    return this.cases.filter((c) => !c.staff || c.staff === '').length;
  }

  // Computed: commentCountMap
  get commentCountMap(): Map<string, number> {
    const map = new Map<string, number>();
    this.comments.forEach((c) => {
      map.set(c.caseId, (map.get(c.caseId) || 0) + 1);
    });
    return map;
  }

  // Computed: caseSpecificComments
  get caseSpecificComments(): Comments[] {
    if (!this.selectedCaseIdForComments) return this.comments;
    return this.comments.filter(
      (c) => c.caseId === this.selectedCaseIdForComments,
    );
  }

  // Computed: selectedCaseData
  get selectedCaseData(): Case | null {
    if (!this.selectedCaseIdForComments) return null;
    return (
      this.cases.find((c) => c.id === this.selectedCaseIdForComments) || null
    );
  }

  // Table columns - built with template refs in ngAfterViewInit
  caseColumns: TableColumn[] = [];

  // Computed: visibleCaseColumns
  get visibleCaseColumns(): TableColumn[] {
    return this.caseColumns.filter(
      (col) =>
        col.key === 'select' ||
        col.key === 'actions' ||
        this.viewSettings.visibleColumns.includes(col.key),
    );
  }

  // Skeleton array for card loading
  skeletonArray = Array(6);

  getDefaultLayout(tab: string): LayoutType {
    if (tab === 'complete') return 'list';
    if (tab === 'unassigned' || tab === 'todo' || tab === 'progress')
      return 'card';
    return 'table';
  }

  ngOnInit(): void {
    // Build table columns (templates are static, available in ngOnInit)
    this.caseColumns = [
      {
        key: 'select',
        type: 'checkbox',
        headerTemplate: this.selectAllHeaderTpl,
        cellTemplate: this.selectCellTpl,
      },
      {
        key: 'name',
        header: 'Name',
        type: 'link',
        cellTemplate: this.nameCellTpl,
      },
      {
        key: 'status',
        header: 'Status',
        type: 'badge',
        sortable: true,
        cellTemplate: this.statusCellTpl,
      },
      {
        key: 'staff',
        header: 'Assigned to',
        type: 'text',
        cellTemplate: this.staffCellTpl,
      },
      {
        key: 'dueDate',
        header: 'Due date',
        type: 'text',
        sortable: true,
        cellTemplate: this.dueDateCellTpl,
      },
      {
        key: 'jurisdiction',
        header: 'Jurisdiction',
        type: 'text',
        sortable: true,
        cellTemplate: this.jurisdictionCellTpl,
      },
      {
        key: 'fileNumber',
        header: 'File number',
        type: 'text',
        cellTemplate: this.fileNumberCellTpl,
      },
      {
        key: 'priority',
        header: 'Priority',
        type: 'badge',
        sortable: true,
        cellTemplate: this.priorityCellTpl,
      },
      {
        key: 'actions',
        type: 'actions',
        cellTemplate: this.actionsCellTpl,
      },
    ];

    // Set up compact toolbar listener
    window.addEventListener('resize', this.resizeHandler);

    // Initialize display settings
    this.displayService.init({
      pageKey: 'cases',
      getDefaultLayout: this.getDefaultLayout.bind(this),
      initialTab: 'all',
    });

    // Load cases
    this.loadCases();

    // Load comments
    this.loadComments();

    // Set up page footer
    this.footerService.setFooter(this.footerTemplate, {
      visibleWhen: 'selection',
      hasSelection: this.selectedCount > 0,
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.footerService.clearFooter();
  }

  private async loadCases(): Promise<void> {
    this.isLoading = true;
    const data = await mockFetch<Case[]>(mockData as Case[]);
    this.cases = data;
    this.isLoading = false;
  }

  private async loadComments(): Promise<void> {
    const data = await mockFetch<Comments[]>(mockComments as Comments[]);
    this.comments = data;
  }

  // --- Event handlers ---

  handleTabChange(event: any): void {
    const tabIndex = event.detail?.tab ?? event.tab;
    const tabMap = ['all', 'unassigned', 'todo', 'progress', 'complete'];
    this.activeTab = tabMap[tabIndex - 1] || 'all';
    this.cases = this.cases.map((c) => ({ ...c, selected: false }));

    // Update layout if not customized
    if (!this.layoutCustomized) {
      this.displayService.setViewSettings({
        ...this.viewSettings,
        layout: this.defaultLayout,
      });
    }
  }

  handleSortAction(action: string): void {
    if (action === 'clear-sort') {
      this.sortService.clearSort();
      return;
    }
    const key = action.replace('sort-', '');
    this.sortByKey(key);
  }

  private sortByKey(key: string): void {
    const sc = this.sortConfig;
    if (sc.primary?.key === key) {
      const newDir = sc.primary.direction === 'asc' ? 'desc' : 'asc';
      this.sortService.handleMultiSort({ name: key, direction: newDir });
    } else if (sc.secondary?.key === key) {
      const newDir = sc.secondary.direction === 'asc' ? 'desc' : 'asc';
      this.sortService.handleMultiSort({ name: key, direction: newDir });
    } else {
      this.sortService.handleMultiSort({ name: key, direction: 'asc' });
    }
  }

  handleSettingsChange(newSettings: ViewSettings): void {
    this.displayService.handleSettingsChange(newSettings, this.defaultLayout);
  }

  applyFilter(valueOverride?: string): void {
    const valueToUse =
      valueOverride !== undefined ? valueOverride : this.inputValue;
    const trimmedValue = valueToUse.trim();
    if (trimmedValue === '') {
      this.inputError = 'Search field empty';
      return;
    }
    if (this.typedChips.includes(trimmedValue)) {
      this.inputValue = '';
      this.inputError = 'You already entered this search term';
      return;
    }
    this.typedChips = [...this.typedChips, trimmedValue];
    this.inputValue = '';
    this.inputError = '';
  }

  handleInputKeyPress(event: any): void {
    if (event.key === 'Enter') {
      const value = event.value;
      setTimeout(() => {
        this.applyFilter(value);
      }, 0);
    }
  }

  handleInputChange(value: string): void {
    this.inputValue = value;
    if (this.inputError) this.inputError = '';
  }

  togglePendingFilter(category: keyof FilterState, value: string): void {
    this.pendingFilters = {
      ...this.pendingFilters,
      [category]: this.pendingFilters[category].includes(value)
        ? this.pendingFilters[category].filter((v) => v !== value)
        : [...this.pendingFilters[category], value],
    };
  }

  applyFilters(): void {
    this.appliedFilters = { ...this.pendingFilters };
    this.filterDrawerOpen = false;
  }

  clearAllFilters(): void {
    const emptyFilters: FilterState = {
      status: [],
      priority: [],
      jurisdiction: [],
      staff: [],
    };
    this.pendingFilters = emptyFilters;
    this.appliedFilters = emptyFilters;
  }

  removeAppliedFilter(category: string, value: string): void {
    this.appliedFilters = {
      ...this.appliedFilters,
      [category]: (
        this.appliedFilters[category as keyof FilterState] || []
      ).filter((v) => v !== value),
    };
  }

  deleteCase(id: string): void {
    this.caseToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.caseToDelete) {
      this.cases = this.cases.filter((c) => c.id !== this.caseToDelete);
    }
    this.showDeleteModal = false;
    this.caseToDelete = null;
  }

  removeChip(chip: string): void {
    this.typedChips = this.typedChips.filter((c) => c !== chip);
  }

  clearAllChips(): void {
    this.typedChips = [];
  }

  handleClearAll(): void {
    this.clearAllChips();
    this.clearAllFilters();
    this.sortService.clearSort();
  }

  handleSelectChange(caseId: string, selected: boolean): void {
    this.cases = this.cases.map((c) =>
      c.id === caseId ? { ...c, selected } : c,
    );
    this.updateFooterSelection();
  }

  handleSelectAll(): void {
    const newValue = !this.isAllSelected && !this.isIndeterminate;
    this.cases = this.cases.map((c) => ({ ...c, selected: newValue }));
    this.updateFooterSelection();
  }

  clearSelection(): void {
    this.cases = this.cases.map((c) => ({ ...c, selected: false }));
    this.updateFooterSelection();
  }

  deleteSelected(): void {
    this.cases = this.cases.filter((c) => !c.selected);
    this.updateFooterSelection();
  }

  private updateFooterSelection(): void {
    this.footerService.hasSelection.set(this.selectedCount > 0);
  }

  onMenuActionButton(action: string, caseId: string): void {
    switch (action) {
      case 'edit':
        break;
      case 'view':
        this.router.navigate(['/case', caseId]);
        break;
      case 'delete':
        this.deleteCase(caseId);
        break;
      case 'comments':
        this.handleCommentsClick(caseId);
        break;
    }
  }

  handleCommentsClick(caseId?: string): void {
    if (caseId) {
      this.selectedCaseIdForComments = caseId;
    }
    this.isCommentsDrawerOpen = true;
  }

  handleEditComment(event: { id: number; text: string }): void {
    this.comments = this.comments.map((c) =>
      c.id === event.id ? { ...c, text: event.text } : c,
    );
  }

  handleDeleteComment(id: number): void {
    this.comments = this.comments.filter((c) => c.id !== id);
  }

  handleFilterOpen(): void {
    this.pendingFilters = { ...this.appliedFilters };
    this.filterDrawerOpen = true;
  }

  handleFilterToggle(event: {
    category: keyof FilterState;
    value: string;
  }): void {
    this.togglePendingFilter(event.category, event.value);
  }

  handleFilterClearAll(): void {
    this.pendingFilters = {
      status: [],
      priority: [],
      jurisdiction: [],
      staff: [],
    };
  }

  handleRemoveFilter(event: { category: string; value: string }): void {
    this.removeAppliedFilter(event.category, event.value);
  }

  handleMultiSort(event: any): void {
    this.sortService.handleMultiSort(event);
  }

  handleRowClick(caseItem: Case): void {
    this.handleSelectChange(caseItem.id, !caseItem.selected);
  }

  handleCardMenuAction(event: { action: string; caseId: string }): void {
    this.onMenuActionButton(event.action, event.caseId);
  }

  handleCardSelectChange(event: { caseId: string; selected: boolean }): void {
    this.handleSelectChange(event.caseId, event.selected);
  }

  handleListMenuAction(event: { action: string; caseId: string }): void {
    this.onMenuActionButton(event.action, event.caseId);
  }

  toggleGroup(groupKey: string): void {
    const next = new Set(this.expandedGroups);
    if (next.has(groupKey)) {
      next.delete(groupKey);
    } else {
      next.add(groupKey);
    }
    this.expandedGroups = next;
  }

  // When groupBy changes, expand all groups by default
  private expandAllGroups(): void {
    if (this.groupedCases) {
      this.expandedGroups = new Set(this.groupedCases.map((g) => g.key));
    }
  }

  // Helper for card grid comment count
  getCommentCount(caseId: string): number {
    return this.commentCountMap.get(caseId) || 0;
  }

  // Helper for priority badge props
  getPriorityBadgeProps(priority: 'high' | 'medium' | 'low') {
    return getPriorityBadgeProps(priority);
  }
}
