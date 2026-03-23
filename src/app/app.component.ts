import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoabxWorkSideMenu, GoabxWorkSideMenuItem } from '@abgov/angular-components';
import { ViewportService } from './services/viewport.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GoabxWorkSideMenu, GoabxWorkSideMenuItem],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  viewport = inject(ViewportService);
}
