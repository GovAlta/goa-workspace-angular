import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  GoabButton,
  GoabAccordion,
  GoabDivider,
  GoabText,
  GoabIconButton,
  GoabTooltip,
} from '@abgov/angular-components';
import { GoabBadge, GoabBadgeType } from '@abgov/angular-components';
import { PrimaryApplicationFormComponent } from '../primary-application-form/primary-application-form.component';
import { Case } from '../../../../types/case';
import { PrimaryFormData } from '../../../../types/primary-form-data';

interface BadgeConfig {
  type: GoabBadgeType;
  content: string;
}

@Component({
  selector: 'app-case-accordions',
  imports: [
    GoabButton,
    GoabAccordion,
    GoabDivider,
    GoabText,
    GoabIconButton,
    GoabTooltip,
    GoabBadge,
    PrimaryApplicationFormComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './case-accordions.component.html',
  styleUrl: './case-accordions.component.css',
})
export class CaseAccordionsComponent {
  @Input() expandedAll = false;
  @Input() expandedList: number[] = [];
  @Input() primaryFormData: PrimaryFormData = {} as PrimaryFormData;
  @Input() caseData: Case | null = null;
  @Input() copiedField: string | null = null;

  @Output() expandOrCollapseAll = new EventEmitter<void>();
  @Output() copyValue = new EventEmitter<{
    value: string;
    fieldName: string;
  }>();
  @Output() primaryFormDataChange = new EventEmitter<PrimaryFormData>();

  get accordionStatuses(): Record<string, string> {
    return (
      (this.caseData?.['accordionStatuses'] as Record<string, string>) || {}
    );
  }

  get primaryApplicantBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['primaryApplicant']);
  }
  get personalBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['personal']);
  }
  get spousePartnerBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['spousePartner']);
  }
  get dependantBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['dependant']);
  }
  get educationBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['education']);
  }
  get employmentBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['employment']);
  }
  get healthBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['health']);
  }
  get identifiedNeedsBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['identifiedNeeds']);
  }
  get labourMarketBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['labourMarket']);
  }
  get decisionBadge(): BadgeConfig {
    return this.getStatusBadge(this.accordionStatuses['decision']);
  }

  isExpanded(index: number): boolean {
    return this.expandedList.includes(index);
  }

  onExpandOrCollapseAll() {
    this.expandOrCollapseAll.emit();
  }

  onCopy(value: string, fieldName: string) {
    this.copyValue.emit({ value, fieldName });
  }

  getCopyTooltip(fieldName: string): string {
    return this.copiedField === fieldName ? 'Copied' : 'Copy';
  }

  getCaseField(field: string): string {
    return (this.caseData?.[field] as string) || '-';
  }

  getStatusBadge(status: string | undefined): BadgeConfig {
    switch (status) {
      case 'complete':
        return { type: 'success', content: 'Complete' };
      case 'missing':
        return { type: 'important', content: 'Missing information' };
      case 'incomplete':
        return { type: 'information', content: 'Incomplete' };
      case 'pending':
        return { type: 'information', content: 'Pending' };
      case 'approved':
        return { type: 'success', content: 'Approved' };
      case 'denied':
        return { type: 'important', content: 'Denied' };
      case 'cancelled':
        return { type: 'default', content: 'Cancelled' };
      case 'not applicable':
        return { type: 'default', content: 'Not applicable' };
      default:
        return { type: 'default', content: 'Unknown' };
    }
  }
}
