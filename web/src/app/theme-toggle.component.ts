import { Component, inject } from '@angular/core';
import { Theme, ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="theme-switch" role="group" aria-label="Color theme" [attr.data-theme]="theme()">
      <span class="theme-thumb" aria-hidden="true"></span>
      <button
        type="button"
        [attr.aria-pressed]="theme() === 'light'"
        (click)="set('light')"
      >
        Light
      </button>
      <button
        type="button"
        [attr.aria-pressed]="theme() === 'dark'"
        (click)="set('dark')"
      >
        Dark
      </button>
    </div>
  `,
})
export class ThemeToggleComponent {
  private readonly themes = inject(ThemeService);
  readonly theme = this.themes.theme;

  set(theme: Theme): void {
    this.themes.set(theme);
  }
}
