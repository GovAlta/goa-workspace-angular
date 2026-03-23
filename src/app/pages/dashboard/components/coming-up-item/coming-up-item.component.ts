import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Case } from '../../../../types/case';

@Component({
  selector: 'app-coming-up-item',
  imports: [RouterLink],
  templateUrl: './coming-up-item.component.html',
})
export class ComingUpItemComponent {
  @Input({ required: true }) caseItem!: Case;
  @Input() relativeDate = '';
}
