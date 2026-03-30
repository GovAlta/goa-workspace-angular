import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorPageComponent } from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-unauthorized',
  imports: [ErrorPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css',
})
export class UnauthorizedComponent {}
