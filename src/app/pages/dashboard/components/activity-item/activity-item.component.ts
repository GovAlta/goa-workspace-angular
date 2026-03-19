import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoabIcon } from '@abgov/angular-components';
import { ActivityItem } from '../../../../types/activity';
import { RelativeTimePipe } from '../../../../pipes/relative-time.pipe';

@Component({
  selector: 'app-activity-item',
  imports: [RouterLink, GoabIcon, RelativeTimePipe],
  templateUrl: './activity-item.component.html',
})
export class ActivityItemComponent {
  @Input({ required: true }) item!: ActivityItem;
}
