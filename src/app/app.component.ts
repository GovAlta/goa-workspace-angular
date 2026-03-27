import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoabWorkSideMenu, GoabWorkSideMenuItem } from '@abgov/angular-components';
import { ViewportService } from './services/viewport.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GoabWorkSideMenu, GoabWorkSideMenuItem],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  viewport = inject(ViewportService);
}
