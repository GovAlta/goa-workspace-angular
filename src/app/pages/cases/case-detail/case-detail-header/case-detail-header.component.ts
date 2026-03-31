import { Component, Input } from '@angular/core';
import {
  GoabIconButton,
  GoabText,
  GoabSkeleton,
  GoabTooltip,
} from '@abgov/angular-components';
import { GoabBadge } from '@abgov/angular-components';
import { GoabBadgeType, GoabBadgeEmphasis } from '@abgov/ui-components-common';

interface StatusItem {
  label: string;
  type?: GoabBadgeType;
  emphasis?: GoabBadgeEmphasis;
}

@Component({
  selector: 'app-case-detail-header',
  imports: [GoabIconButton, GoabText, GoabSkeleton, GoabTooltip, GoabBadge],
  templateUrl: './case-detail-header.component.html',
  styleUrl: './case-detail-header.component.css',
})
export class CaseDetailHeaderComponent {
  @Input() phoneNumber = '456 789 0123';
  @Input() statuses: StatusItem[] = [
    { label: 'Overdue', type: 'emergency' },
    { label: 'Approach with caution', type: 'important' },
  ];
  @Input() isLoading = false;

  copiedField: string | null = null;

  handleCopy(value: string, fieldName: string) {
    navigator.clipboard.writeText(value).then(() => {
      this.copiedField = fieldName;
      setTimeout(() => (this.copiedField = null), 1000);
    });
  }

  getCopyTooltip(fieldName: string): string {
    return this.copiedField === fieldName ? 'Copied' : 'Copy';
  }
}
