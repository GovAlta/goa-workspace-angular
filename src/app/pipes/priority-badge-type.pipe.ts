import { Pipe, PipeTransform } from '@angular/core';
import { GoabBadgeType } from '@abgov/ui-components-common';

const PRIORITY_BADGE_TYPE: Record<string, GoabBadgeType> = {
  high: 'emergency',
  medium: 'important',
  low: 'information',
};

@Pipe({ name: 'priorityBadgeType' })
export class PriorityBadgeTypePipe implements PipeTransform {
  transform(priority: string): GoabBadgeType {
    return PRIORITY_BADGE_TYPE[priority] || 'information';
  }
}
