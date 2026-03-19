import {
  Component,
  OnDestroy,
  ElementRef,
  effect,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportService } from '../../services/viewport.service';
import { ScrollStateService } from '../../services/scroll-state.service';
import { PageFooterComponent } from '../page-footer/page-footer.component';

@Component({
  selector: 'app-workspace-layout',
  imports: [RouterOutlet, PageFooterComponent],
  templateUrl: './workspace-layout.component.html',
  styleUrl: './workspace-layout.component.css',
})
export class WorkspaceLayoutComponent implements OnDestroy {
  constructor(
    public viewport: ViewportService,
    public scrollState: ScrollStateService,
    private el: ElementRef,
  ) {
    effect(() => {
      const isMobile = this.viewport.isMobile();
      // Wait one tick for the template to re-render after isMobile changes
      requestAnimationFrame(() => {
        this.attachScrollObserver(isMobile);
      });
    });
  }

  ngOnDestroy() {
    this.scrollState.detach();
  }

  private attachScrollObserver(isMobile: boolean) {
    const selector = isMobile
      ? '.mobile-content-container'
      : '.desktop-card-container';
    const container = this.el.nativeElement.querySelector(selector);
    if (container) {
      this.scrollState.attach(container);
    }
  }
}
