import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { GoabxBadge } from '@abgov/angular-components';
import { Case } from '../../../../types/case';
import { PriorityBadgeTypePipe } from '../../../../pipes/priority-badge-type.pipe';

@Component({
  selector: 'app-work-queue-card',
  imports: [RouterLink, TitleCasePipe, GoabxBadge, PriorityBadgeTypePipe],
  templateUrl: './work-queue-card.component.html',
})
export class WorkQueueCardComponent {
  @Input({ required: true }) caseItem!: Case;
  @Input() isOverdue = false;
}
