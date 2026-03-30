import {
  Component,
  inject,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportService } from '../../services/viewport.service';
import { ScrollStateService } from '../../services/scroll-state.service';
import { PageFooterComponent } from '../page-footer/page-footer.component';

@Component({
  selector: 'app-workspace-layout',
  imports: [RouterOutlet, PageFooterComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './workspace-layout.component.html',
  styleUrl: './workspace-layout.component.css',
})
export class WorkspaceLayoutComponent implements AfterViewInit, OnDestroy {
  viewport = inject(ViewportService);
  scrollState = inject(ScrollStateService);
  private el = inject(ElementRef);

  ngAfterViewInit() {
    this.attachScrollObserver();
  }

  ngOnDestroy() {
    this.scrollState.detach();
  }

  private attachScrollObserver() {
    const selector = this.viewport.isMobile()
      ? '.mobile-content-container'
      : '.desktop-card-container';
    const container = this.el.nativeElement.querySelector(selector);
    if (container) {
      this.scrollState.attach(container);
    }
  }
}
