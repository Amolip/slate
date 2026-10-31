import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, ThemeToggleComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly demo = environment.demo;
  email = 'demo@slate.app';
  password = 'slate1234';
  showPassword = false;
  error = signal('');
  pending = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  async submit(): Promise<void> {
    this.error.set('');
    this.pending.set(true);
    try {
      await this.auth.login(this.email, this.password);
      await this.router.navigateByUrl('/board');
    } catch (err) {
      this.error.set(this.message(err));
    } finally {
      this.pending.set(false);
    }
  }

  private message(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as { message?: string | string[] };
      if (Array.isArray(body?.message)) return body.message[0];
      if (typeof body?.message === 'string') return body.message;
      if (err.status === 0) {
        return 'Cannot reach the NestJS API. Start it with npm run api.';
      }
    }
    return 'Could not sign in. Check your details and try again.';
  }
}
