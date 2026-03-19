import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorPageComponent } from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-not-found',
  imports: [ErrorPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {}
