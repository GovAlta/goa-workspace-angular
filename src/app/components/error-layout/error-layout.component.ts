import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { GoabIcon, GoabText } from '@abgov/angular-components';
import { GoabIconType } from '@abgov/ui-components-common';

@Component({
  selector: 'app-error-layout',
  imports: [GoabIcon, GoabText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './error-layout.component.html',
  styleUrl: './error-layout.component.css',
})
export class ErrorLayoutComponent {
  @Input({ required: true }) icon!: GoabIconType;
  @Input() label?: string;
  @Input({ required: true }) heading!: string;
  @Input({ required: true }) description!: string;
}
