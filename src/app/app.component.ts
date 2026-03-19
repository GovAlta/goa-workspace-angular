import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoabxWorkSideMenu, GoabxWorkSideMenuItem } from '@abgov/angular-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GoabxWorkSideMenu, GoabxWorkSideMenuItem],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  menuOpen = true;

  onMenuToggle() {
    this.menuOpen = !this.menuOpen;
  }
}
