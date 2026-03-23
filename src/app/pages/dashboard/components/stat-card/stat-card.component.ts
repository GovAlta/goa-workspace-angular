import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoabIcon } from '@abgov/angular-components';
import { GoabIconType } from '@abgov/ui-components-common';

@Component({
  selector: 'app-stat-card',
  imports: [GoabIcon],
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  @Input() value = 0;
  @Input() label = '';
  @Input() icon!: GoabIconType;
  @Input() tint?: 'emergency' | 'important' | 'success' | 'info';
  @Output() onClick = new EventEmitter<void>();

  get clickable(): boolean {
    return this.onClick.observed;
  }

  private tintIconColors: Record<string, string> = {
    emergency: 'var(--goa-color-emergency-default)',
    important: 'var(--goa-color-important-text-dark)',
    success: 'var(--goa-color-success-default)',
    info: 'var(--goa-color-info-default)',
  };

  get iconColor(): string {
    return this.tint ? this.tintIconColors[this.tint] : 'var(--goa-color-interactive-default)';
  }
}
