import { GoabIconType } from '@abgov/ui-components-common';

export interface ActivityItem {
  id: string;
  timestamp: string;
  action: string;
  caseId: string;
  caseName: string;
  icon: GoabIconType;
}
