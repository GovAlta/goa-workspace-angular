import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoabPageBlock, GoabText } from '@abgov/angular-components';

@Component({
  selector: 'app-notifications',
  imports: [GoabPageBlock, GoabText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {}
