import { Injectable, signal, TemplateRef } from '@angular/core';

export type FooterVisibilityMode =
  | 'always'
  | 'selection'
  | 'scrolled'
  | boolean;

@Injectable({ providedIn: 'root' })
export class PageFooterService {
  content = signal<TemplateRef<unknown> | null>(null);
  visibleWhen = signal<FooterVisibilityMode>('always');
  hasSelection = signal(false);

  setFooter(
    content: TemplateRef<unknown>,
    options?: { visibleWhen?: FooterVisibilityMode; hasSelection?: boolean },
  ) {
    this.content.set(content);
    this.visibleWhen.set(options?.visibleWhen ?? 'always');
    this.hasSelection.set(options?.hasSelection ?? false);
  }

  clearFooter() {
    this.content.set(null);
    this.visibleWhen.set('always');
    this.hasSelection.set(false);
  }
}
