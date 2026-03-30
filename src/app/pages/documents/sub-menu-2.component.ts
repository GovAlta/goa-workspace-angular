import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoabPageBlock, GoabText } from '@abgov/angular-components';

@Component({
  selector: 'app-sub-menu-2',
  imports: [GoabPageBlock, GoabText],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sub-menu-2.component.html',
  styleUrl: './sub-menu-2.component.css',
})
export class SubMenu2Component {}
