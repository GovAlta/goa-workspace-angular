import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { GoabText, GoabIconButton } from '@abgov/angular-components';
import { ViewportService } from '../../services/viewport.service';
import { ScrollStateService } from '../../services/scroll-state.service';

@Component({
  selector: 'app-page-header',
  imports: [GoabText, GoabIconButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() hideTitleOnScroll = false;
  @Input() hasTabs = false;
  @Input() hasToolbar = false;

  constructor(
    public viewport: ViewportService,
    public scrollState: ScrollStateService,
  ) {}

  get isCollapsed(): boolean {
    const pos = this.scrollState.scrollPosition();
    return pos === 'middle' || pos === 'at-bottom';
  }

  get headerClasses(): string {
    const pos = this.scrollState.scrollPosition();
    const scrollable = this.scrollState.isScrollable();
    return [
      'page-header',
      this.isCollapsed ? 'page-header--collapsed' : 'page-header--expanded',
      scrollable && pos ? `page-header--${pos.replace(/-/g, '')}` : '',
      this.hasTabs ? 'page-header--with-tabs' : '',
      this.hasToolbar ? 'page-header--with-toolbar' : '',
      this.hideTitleOnScroll ? 'page-header--hide-title-on-scroll' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  openMenu() {
    this.viewport.setMenuOpen(true);
  }
}
