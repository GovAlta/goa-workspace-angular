import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { GoabContainer, GoabText, GoabBlock } from '@abgov/angular-components';
import {
  GoabxCheckbox,
  GoabxBadge,
  GoabxLink,
  GoabxButton,
  GoabxMenuButton,
  GoabxMenuAction,
} from '@abgov/angular-components';
import { GoabMenuButtonOnActionDetail } from '@abgov/ui-components-common';
import { Case } from '../../../../types/case';

const CATEGORY_LABELS: Record<string, string> = {
  todo: 'To do',
  progress: 'In progress',
  complete: 'Complete',
};

@Component({
  selector: 'app-case-card',
  imports: [
    GoabContainer,
    GoabText,
    GoabBlock,
    GoabxCheckbox,
    GoabxBadge,
    GoabxLink,
    GoabxButton,
    GoabxMenuButton,
    GoabxMenuAction,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './case-card.component.html',
  styleUrl: './case-card.component.css',
})
export class CaseCardComponent {
  @Input({ required: true }) caseItem!: Case;
  @Input({ required: true }) activeTab!: string;
  @Input() commentCount = 0;

  @Output() menuAction = new EventEmitter<{ action: string; caseId: string }>();
  @Output() selectChange = new EventEmitter<{
    caseId: string;
    selected: boolean;
  }>();

  categoryLabel(category: string): string {
    return CATEGORY_LABELS[category] || category || '\u2014';
  }

  onMenuAction(event: GoabMenuButtonOnActionDetail, caseId: string) {
    this.menuAction.emit({ action: event.action, caseId });
  }

  onSelectChange() {
    this.selectChange.emit({
      caseId: this.caseItem.id,
      selected: !this.caseItem.selected,
    });
  }

  onCommentClick() {
    this.menuAction.emit({
      action: 'comments',
      caseId: this.caseItem.id,
    });
  }

  onStartClick() {
    this.menuAction.emit({
      action: 'start',
      caseId: this.caseItem.id,
    });
  }
}
