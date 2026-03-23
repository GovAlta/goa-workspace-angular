import { Pipe, PipeTransform } from '@angular/core';
import { GoabxBadgeType } from '@abgov/ui-components-common';

const PRIORITY_BADGE_TYPE: Record<string, GoabxBadgeType> = {
  high: 'emergency',
  medium: 'important',
  low: 'information',
};

@Pipe({ name: 'priorityBadgeType' })
export class PriorityBadgeTypePipe implements PipeTransform {
  transform(priority: string): GoabxBadgeType {
    return PRIORITY_BADGE_TYPE[priority] || 'information';
  }
}
