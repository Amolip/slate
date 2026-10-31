import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { evaluatePasswordRules, isStrongPassword } from './password-rules';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, ThemeToggleComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  readonly demo = environment.demo;
  name = '';
  email = '';
  password = '';
  showPassword = false;
  error = signal('');
  pending = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  get rules() {
    return evaluatePasswordRules(this.password);
  }

  get passwordReady(): boolean {
    return isStrongPassword(this.password);
  }

  async submit(): Promise<void> {
    if (!this.passwordReady) {
      this.error.set('Choose a password that meets every rule below.');
      return;
    }
    this.error.set('');
    this.pending.set(true);
    try {
      await this.auth.register(this.name, this.email, this.password);
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
    return 'Could not create the account. Check your details and try again.';
  }
}
