import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoabPageBlock, GoabText } from '@abgov/angular-components';

@Component({
  selector: 'app-schedule',
  imports: [GoabPageBlock, GoabText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css',
})
export class ScheduleComponent {}
