import { Component, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { PageFooterService } from '../../services/page-footer.service';
import { ScrollStateService } from '../../services/scroll-state.service';

@Component({
  selector: 'app-page-footer',
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './page-footer.component.html',
  styleUrl: './page-footer.component.css',
})
export class PageFooterComponent {
  constructor(
    public footer: PageFooterService,
    public scrollState: ScrollStateService,
  ) {}

  get isVisible(): boolean {
    const content = this.footer.content();
    if (!content) return false;

    const mode = this.footer.visibleWhen();
    if (mode === false) return false;
    if (mode === 'selection') return this.footer.hasSelection();
    if (mode === 'scrolled') {
      const pos = this.scrollState.scrollPosition();
      return (
        this.scrollState.isScrollable() &&
        pos !== 'at-top' &&
        pos !== 'no-scroll'
      );
    }
    return true; // 'always', true, or default
  }

  get footerClasses(): string {
    const pos = this.scrollState.scrollPosition();
    const scrollable = this.scrollState.isScrollable();
    return [
      'page-footer',
      scrollable && pos ? `page-footer--${pos.replace(/-/g, '')}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
