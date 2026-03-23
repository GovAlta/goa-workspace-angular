import { Injectable, signal } from '@angular/core';

const MOBILE_BREAKPOINT = 623;
const MENU_STATE_KEY = 'workspace-menu-open';

function getInitialMenuState(): boolean {
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    return false;
  }
  const saved = localStorage.getItem(MENU_STATE_KEY);
  if (saved !== null) {
    return saved === 'true';
  }
  return true;
}

@Injectable({ providedIn: 'root' })
export class ViewportService {
  isMobile = signal(window.innerWidth < MOBILE_BREAKPOINT);
  menuOpen = signal(getInitialMenuState());

  constructor() {
    let previousWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      this.isMobile.set(width < MOBILE_BREAKPOINT);

      if (width < previousWidth) {
        this.menuOpen.set(false);
      }

      previousWidth = width;
    });
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
    if (!this.isMobile()) {
      localStorage.setItem(MENU_STATE_KEY, String(this.menuOpen()));
    }
  }
}
