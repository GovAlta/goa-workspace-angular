import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  GoabButtonGroup,
  GoabText,
  GoabModal,
  GoabButton,
} from '@abgov/angular-components';

@Component({
  selector: 'app-case-delete-modal',
  imports: [GoabButtonGroup, GoabText, GoabModal, GoabButton],
  templateUrl: './case-delete-modal.component.html',
  styleUrl: './case-delete-modal.component.css',
})
export class CaseDeleteModalComponent {
  @Input() open = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
