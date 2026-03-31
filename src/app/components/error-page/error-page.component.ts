import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GoabButton } from '@abgov/angular-components';
import { GoabIconType } from '@abgov/ui-components-common';
import { ErrorLayoutComponent } from '../error-layout/error-layout.component';

@Component({
  selector: 'app-error-page',
  imports: [GoabButton, ErrorLayoutComponent],
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
