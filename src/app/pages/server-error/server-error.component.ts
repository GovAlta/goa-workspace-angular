import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorPageComponent } from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-server-error',
  imports: [ErrorPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css',
})
export class ServerErrorComponent {}
