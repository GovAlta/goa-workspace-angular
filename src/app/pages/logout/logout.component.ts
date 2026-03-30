import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorPageComponent } from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-logout',
  imports: [ErrorPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {}
