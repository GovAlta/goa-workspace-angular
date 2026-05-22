import { Injectable, computed, inject, signal } from '@angular/core';
import { ViewportService } from './viewport.service';

const MENU_STATE_KEY = 'workspace-menu-open';

/**
 * Persists the side menu's expanded vs collapsed state across page reloads.
 *
 * Only relevant on desktop. On mobile, goa-workspace-layout owns side-menu
 * visibility via its built-in mobile drawer (slide-in / backdrop / ESC) —
 * this service no-ops there and always reports the menu as "expanded" so
 * the drawer's slide-in shows the full menu (labels + groups), not the
 * icon-only collapsed column.
 */
function getInitialDesktopMenuState(): boolean {
  const saved = localStorage.getItem(MENU_STATE_KEY);
  if (saved !== null) {
    return saved === 'true';
  }
  return true;
}

@Injectable({ providedIn: 'root' })
export class MenuStateService {
  private viewport = inject(ViewportService);

  /** Desktop-only persisted state. Use the computed `menuOpen` for binding. */
  private _desktopMenuOpen = signal(getInitialDesktopMenuState());

  /**
   * Whether the side menu should render in expanded form.
   * - Desktop: persisted state, toggled via the side menu's bottom button.
   * - Mobile: always `true` so the workspace layout's drawer shows the full
   *   menu when it slides in.
   */
  menuOpen = computed(() =>
    this.viewport.isMobile() ? true : this._desktopMenuOpen(),
  );

  constructor() {
    // Auto-collapse desktop menu when the user shrinks the window (without
    // crossing into mobile, where the drawer takes over).
    let previousWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      if (width < previousWidth && !this.viewport.isMobile()) {
        this._desktopMenuOpen.set(false);
      }
      previousWidth = width;
    });
  }

  toggleMenu(): void {
    if (this.viewport.isMobile()) return;
    this._desktopMenuOpen.update((open) => !open);
    localStorage.setItem(MENU_STATE_KEY, String(this._desktopMenuOpen()));
  }

  setMenuOpen(open: boolean): void {
    if (this.viewport.isMobile()) return;
    this._desktopMenuOpen.set(open);
    localStorage.setItem(MENU_STATE_KEY, String(open));
  }
}
