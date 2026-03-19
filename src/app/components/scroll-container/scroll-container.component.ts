import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-scroll-container',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './scroll-container.component.html',
  styleUrl: './scroll-container.component.css',
})
export class ScrollContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollbar') scrollbarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('leftShadow') leftShadowRef!: ElementRef<HTMLDivElement>;
  @ViewChild('rightShadow') rightShadowRef!: ElementRef<HTMLDivElement>;

  scrollWidth = 0;
  showScrollbar = false;
  scrollbarPosition = { left: 0, bottom: 0, width: 0 };
  shadowLeft = false;
  shadowRight = false;

  private isScrollingSelf = false;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    const container = this.containerRef.nativeElement;
    const scrollbar = this.scrollbarRef?.nativeElement;
    const cardContainer = document.querySelector('.desktop-card-container');

    this.updateDimensions();
    this.updateShadows();
    this.updateShadowHeights();

    container.addEventListener('scroll', this.handleContentScroll, {
      passive: true,
    });

    if (scrollbar) {
      scrollbar.addEventListener('scroll', this.handleScrollbarScroll, {
        passive: true,
      });
    }

    if (cardContainer) {
      cardContainer.addEventListener('scroll', this.handleCardScroll, {
        passive: true,
      });
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateDimensions();
      this.updateShadows();
      this.updateShadowHeights();
    });
    this.resizeObserver.observe(container);
    if (cardContainer) {
      this.resizeObserver.observe(cardContainer);
    }

    window.addEventListener('resize', this.handleWindowResize, {
      passive: true,
    });
  }

  ngOnDestroy() {
    const container = this.containerRef?.nativeElement;
    const scrollbar = this.scrollbarRef?.nativeElement;
    const cardContainer = document.querySelector('.desktop-card-container');

    container?.removeEventListener('scroll', this.handleContentScroll);
    scrollbar?.removeEventListener('scroll', this.handleScrollbarScroll);
    cardContainer?.removeEventListener('scroll', this.handleCardScroll);
    window.removeEventListener('resize', this.handleWindowResize);
    this.resizeObserver?.disconnect();
  }

  private handleContentScroll = () => {
    this.updateShadows();
    if (this.isScrollingSelf) return;

    const container = this.containerRef.nativeElement;
    const scrollbar = this.scrollbarRef?.nativeElement;
    if (!scrollbar) return;

    this.isScrollingSelf = true;
    scrollbar.scrollLeft = container.scrollLeft;
    requestAnimationFrame(() => {
      this.isScrollingSelf = false;
    });
  };

  private handleScrollbarScroll = () => {
    if (this.isScrollingSelf) return;

    const container = this.containerRef.nativeElement;
    const scrollbar = this.scrollbarRef?.nativeElement;
    if (!scrollbar) return;

    this.isScrollingSelf = true;
    container.scrollLeft = scrollbar.scrollLeft;
    requestAnimationFrame(() => {
      this.isScrollingSelf = false;
      this.updateShadows();
    });
  };

  private handleCardScroll = () => {
    requestAnimationFrame(() => this.updateDimensions());
  };

  private handleWindowResize = () => {
    this.updateDimensions();
  };

  private updateShadowHeights() {
    const container = this.containerRef?.nativeElement;
    const leftShadow = this.leftShadowRef?.nativeElement;
    const rightShadow = this.rightShadowRef?.nativeElement;
    if (!container || !leftShadow || !rightShadow) return;

    const contentChild = container.children[1] as HTMLElement;
    if (contentChild && contentChild.offsetHeight > 0) {
      const height = `${contentChild.offsetHeight}px`;
      leftShadow.style.height = height;
      rightShadow.style.height = height;
    }
  }

  private updateShadows() {
    const container = this.containerRef?.nativeElement;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    const contentChild = container.children[1] as HTMLElement;
    const margin = contentChild
      ? parseFloat(getComputedStyle(contentChild).marginLeft) || 0
      : 0;

    this.shadowLeft = scrollLeft > margin;
    this.shadowRight = scrollLeft < maxScroll - margin;
  }

  private updateDimensions() {
    const container = this.containerRef?.nativeElement;
    const cardContainer = document.querySelector('.desktop-card-container');
    if (!container) return;

    const newScrollWidth = container.scrollWidth;
    const newClientWidth = container.clientWidth;
    const needsScrollbar = newScrollWidth > newClientWidth;

    this.scrollWidth = newScrollWidth;
    this.showScrollbar = needsScrollbar;

    if (needsScrollbar && cardContainer) {
      const cardRect = cardContainer.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const bottomInset = 6;

      const innerContent = container.firstElementChild as HTMLElement;
      if (innerContent) {
        const computedStyle = window.getComputedStyle(innerContent);
        const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
        const marginRight = parseFloat(computedStyle.marginRight) || 0;

        this.scrollbarPosition = {
          left: containerRect.left + marginLeft,
          bottom: window.innerHeight - cardRect.bottom + bottomInset,
          width: containerRect.width - marginLeft - marginRight,
        };
      }
    }
  }
}
