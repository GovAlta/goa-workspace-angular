import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GoabxButton } from '@abgov/angular-components';
import { GoabIconType } from '@abgov/ui-components-common';
import { ErrorLayoutComponent } from '../error-layout/error-layout.component';

@Component({
  selector: 'app-error-page',
  imports: [GoabxButton, ErrorLayoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  @Input({ required: true }) icon!: GoabIconType;
  @Input() errorCode?: string;
  @Input({ required: true }) heading!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) buttonText!: string;
  @Input({ required: true }) buttonLink!: string;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.buttonLink]);
  }
}
