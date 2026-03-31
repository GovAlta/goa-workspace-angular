import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GoabSkeleton,
  GoabSpacer,
  GoabTab,
  GoabText,
} from '@abgov/angular-components';
import {
  GoabxBadge,
  GoabxButton,
  GoabxTabs,
  GoabxMenuButton,
  GoabxMenuAction,
  GoabTabsOnChangeDetail,
} from '@abgov/angular-components';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { CommentsDrawerComponent } from '../../../components/comments-drawer/comments-drawer.component';
import { CaseDetailHeaderComponent } from './case-detail-header/case-detail-header.component';
import { CaseAccordionsComponent } from './case-accordions/case-accordions.component';
import { ViewportService } from '../../../services/viewport.service';
import { Case } from '../../../types/case';
import { Comments } from '../../../types/comments';
import { PrimaryFormData } from '../../../types/primary-form-data';
import { mockFetch } from '../../../utils/mock-api';

import mockCases from '../../../data/mockCases.json';
import mockComments from '../../../data/mockComments.json';

@Component({
  selector: 'app-case-detail',
  imports: [
    GoabSkeleton,
    GoabSpacer,
    GoabTab,
    GoabText,
    GoabxBadge,
    GoabxButton,
    GoabxTabs,
    GoabxMenuButton,
    GoabxMenuAction,
    PageHeaderComponent,
    CommentsDrawerComponent,
    CaseDetailHeaderComponent,
    CaseAccordionsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.css',
})
export class CaseDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public viewport: ViewportService,
  ) {}

  isLoading = true;
  caseData: Case | null = null;
  copiedField: string | null = null;
  isCommentsDrawerOpen = false;
  expandedAll = false;
  expandedList: number[] = [];
  activeTabIndex = 1;
  comments: Comments[] = [];

  // Skeleton array for loading state
  skeletonArray = Array(9);

  get primaryFormData(): PrimaryFormData {
    return {
      firstName: (this.caseData?.['firstName'] as string) || '',
      middleName: (this.caseData?.['middleName'] as string) || '',
      lastName: (this.caseData?.['lastName'] as string) || '',
      lastNameOnBirthCertificate:
        (this.caseData?.['lastNameOnBirthCertificate'] as string) || '',
      sin: (this.caseData?.['sin'] as string) || '',
      sinVerified: (this.caseData?.['sinVerified'] as boolean) || false,
      verification: (this.caseData?.['verification'] as boolean) || false,
      albertaHealthNumber:
        (this.caseData?.['albertaHealthNumber'] as string) || '',
      lisaFileNumber: (this.caseData?.['lisaFileNumber'] as string) || '',
      hsId: (this.caseData?.['hsId'] as string) || '',
      pid: (this.caseData?.['pid'] as string) || '',
    };
  }

  get isMobile(): boolean {
    return this.viewport.isMobile();
  }

  get commentsButtonText(): string {
    return this.isLoading
      ? 'Comments'
      : 'Comments (' + this.comments.length + ')';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchCaseData(id);
        this.loadComments(id);
      }
    });
  }

  private async fetchCaseData(id: string): Promise<void> {
    this.isLoading = true;
    const foundCase = (mockCases as Case[]).find((c) => c.id === id);
    const data = await mockFetch<Case>(foundCase as Case);
    this.caseData = data;
    this.isLoading = false;
  }

  private async loadComments(id: string): Promise<void> {
    const data = await mockFetch<Comments[]>(mockComments as Comments[]);
    this.comments = data.filter((c) => c.caseId === id);
  }

  expandOrCollapseAll() {
    this.expandedAll = !this.expandedAll;
    this.expandedList = this.expandedAll ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [];
  }

  handleTabsChange(event: GoabTabsOnChangeDetail) {
    this.activeTabIndex = event.tab;
  }

  handleAssignClick() {
    console.log('Assign button clicked');
  }

  handleCommentsClick() {
    this.isCommentsDrawerOpen = true;
  }

  handleEditComment(event: { id: number; text: string }) {
    this.comments = this.comments.map((c) =>
      c.id === event.id ? { ...c, text: event.text } : c,
    );
  }

  handleDeleteComment(id: number) {
    this.comments = this.comments.filter((c) => c.id !== id);
  }

  handleCopy(event: { value: string; fieldName: string }) {
    navigator.clipboard.writeText(event.value).then(() => {
      this.copiedField = event.fieldName;
      setTimeout(() => (this.copiedField = null), 1000);
    });
  }
}
