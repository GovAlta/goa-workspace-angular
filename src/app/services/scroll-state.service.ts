import { Injectable, signal, computed, NgZone, inject } from '@angular/core';
import { ViewportService } from './viewport.service';

export type ScrollPosition = 'no-scroll' | 'at-top' | 'middle' | 'at-bottom';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private zone = inject(NgZone);
  private viewport = inject(ViewportService);

  private _scrollPosition = signal<ScrollPosition>('no-scroll');
  private _isScrollable = signal(false);

  scrollPosition = this._scrollPosition.asReadonly();
  isScrollable = this._isScrollable.asReadonly();

  private transitionLockUntil = 0;
  private animationFrameId: number | null = null;
  private resizeObserver?: ResizeObserver;
  private resizeDebounceId?: ReturnType<typeof setTimeout>;
  private currentContainer: Element | null = null;
  private boundHandleScroll = this.handleScroll.bind(this);
  private boundHandleWindowResize = this.handleWindowResize.bind(this);

  private readonly TRANSITION_DURATION = 250;

  attach(container: Element) {
    this.detach();
    this.currentContainer = container;

    this.calculateScrollState();

    container.addEventListener('scroll', this.boundHandleScroll, {
      passive: true,
    });

    this.resizeObserver = new ResizeObserver(() => {
      if (this.resizeDebounceId) {
        clearTimeout(this.resizeDebounceId);
      }
      this.resizeDebounceId = setTimeout(() => {
        this.calculateScrollState();
        this.resizeDebounceId = undefined;
      }, this.TRANSITION_DURATION);
    });

    this.resizeObserver.observe(container);
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      this.resizeObserver.observe(children[i]);
    }

    window.addEventListener('resize', this.boundHandleWindowResize, {
      passive: true,
    });
  }

  detach() {
    if (this.currentContainer) {
      this.currentContainer.removeEventListener(
        'scroll',
        this.boundHandleScroll,
      );
    }
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.boundHandleWindowResize);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeDebounceId) clearTimeout(this.resizeDebounceId);
    this.currentContainer = null;
  }

  private handleScroll() {
    if (this.animationFrameId) return;
    this.animationFrameId = requestAnimationFrame(() => {
      this.calculateScrollState();
      this.animationFrameId = null;
    });
  }

  private handleWindowResize() {
    setTimeout(() => this.calculateScrollState(), 10);
  }

  private calculateScrollState() {
    const container = this.currentContainer;
    if (!container) {
      this._scrollPosition.set('no-scroll');
      this._isScrollable.set(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollOverflow = scrollHeight - clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    const scrollableEnterThreshold = 1;
    const scrollableExitThreshold = 100;
    const enterThreshold = 5;
    const exitThreshold = 15;

    // Update isScrollable with hysteresis
    const wasScrollable = this._isScrollable();
    if (wasScrollable) {
      this._isScrollable.set(scrollOverflow > -scrollableExitThreshold);
    } else {
      this._isScrollable.set(scrollOverflow > scrollableEnterThreshold);
    }

    // Calculate target scroll position
    const prev = this._scrollPosition();
    const target = this.calculateTargetPosition(
      prev,
      scrollTop,
      distanceFromBottom,
      scrollOverflow,
      scrollableEnterThreshold,
      scrollableExitThreshold,
      enterThreshold,
      exitThreshold,
    );

    if (target !== prev) {
      const now = Date.now();
      if (now >= this.transitionLockUntil) {
        this.transitionLockUntil = now; // TRANSITION_LOCK_MS is 0 in React
        this._scrollPosition.set(target);
      }
    }
  }

  private calculateTargetPosition(
    prev: ScrollPosition,
    scrollTop: number,
    distanceFromBottom: number,
    scrollOverflow: number,
    scrollableEnterThreshold: number,
    scrollableExitThreshold: number,
    enterThreshold: number,
    exitThreshold: number,
  ): ScrollPosition {
    if (prev === 'no-scroll') {
      if (scrollOverflow <= scrollableEnterThreshold) return 'no-scroll';
      if (scrollTop <= enterThreshold) return 'at-top';
      if (distanceFromBottom <= enterThreshold) return 'at-bottom';
      return 'middle';
    }

    if (scrollOverflow <= -scrollableExitThreshold) return 'no-scroll';

    if (prev === 'at-top') {
      return scrollTop > exitThreshold ? 'middle' : 'at-top';
    }

    if (prev === 'at-bottom') {
      return distanceFromBottom > exitThreshold ? 'middle' : 'at-bottom';
    }

    // prev === 'middle'
    if (scrollTop <= enterThreshold) return 'at-top';
    if (distanceFromBottom <= enterThreshold) return 'at-bottom';
    return 'middle';
  }
}
