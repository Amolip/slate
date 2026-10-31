import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'slate.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(readTheme());

  constructor() {
    this.apply(this.theme());
  }

  set(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.apply(theme, true);
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: Theme, animate = false): void {
    const paint = () => {
      const root = document.documentElement;
      root.dataset['theme'] = theme;
      root.style.colorScheme = theme;
    };

    if (animate && typeof document.startViewTransition === 'function') {
      document.startViewTransition(paint);
      return;
    }

    paint();
  }
}

function readTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
