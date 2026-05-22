import { Injectable, signal } from '@angular/core';

const MOBILE_BREAKPOINT = 623;

@Injectable({ providedIn: 'root' })
export class ViewportService {
  isMobile = signal(window.innerWidth < MOBILE_BREAKPOINT);

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < MOBILE_BREAKPOINT);
    });
  }
}
