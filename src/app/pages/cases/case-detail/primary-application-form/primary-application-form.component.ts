import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  GoabCheckbox,
  GoabDivider,
  GoabIconButton,
  GoabText,
  GoabTooltip,
} from '@abgov/angular-components';
import { GoabxFormItem, GoabxInput } from '@abgov/angular-components';
import { PrimaryFormData } from '../../../../types/primary-form-data';

@Component({
  selector: 'app-primary-application-form',
  imports: [
    GoabCheckbox,
    GoabDivider,
    GoabIconButton,
    GoabText,
    GoabTooltip,
    GoabxFormItem,
    GoabxInput,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './primary-application-form.component.html',
  styleUrl: './primary-application-form.component.css',
})
export class PrimaryApplicationFormComponent implements OnChanges {
  @Input() formData: PrimaryFormData = {} as PrimaryFormData;
  @Output() formDataChange = new EventEmitter<PrimaryFormData>();

  localFormData: PrimaryFormData = {} as PrimaryFormData;
  copiedField: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.formData) {
      this.localFormData = { ...this.formData };
    }
  }

  handleInputChange(field: keyof PrimaryFormData, value: string | boolean) {
    this.localFormData = {
      ...this.localFormData,
      [field]: value,
    };
    this.formDataChange.emit(this.localFormData);
  }

  handleCopy(value: string, fieldName: string) {
    navigator.clipboard.writeText(value).then(() => {
      this.copiedField = fieldName;
      setTimeout(() => (this.copiedField = null), 1000);
    });
  }

  getCopyTooltip(fieldName: string): string {
    return this.copiedField === fieldName ? 'Copied' : 'Copy';
  }
}
