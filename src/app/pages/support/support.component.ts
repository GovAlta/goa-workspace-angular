import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoabPageBlock, GoabText } from '@abgov/angular-components';

@Component({
  selector: 'app-support',
  imports: [GoabPageBlock, GoabText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css',
})
export class SupportComponent {}
