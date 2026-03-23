import { Pipe, PipeTransform } from '@angular/core';
import { formatRelativeTime } from '../utils/date-utils';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(timestamp: string): string {
    return formatRelativeTime(timestamp);
  }
}
