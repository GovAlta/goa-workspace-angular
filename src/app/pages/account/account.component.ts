import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoabPageBlock, GoabText } from '@abgov/angular-components';

@Component({
  selector: 'app-account',
  imports: [GoabPageBlock, GoabText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {}
