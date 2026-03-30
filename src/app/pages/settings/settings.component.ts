import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorPageComponent } from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-settings',
  imports: [ErrorPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {}
