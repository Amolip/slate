import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { Session, User } from './models';

const TOKEN_KEY = 'slate.token';
const USER_KEY = 'slate.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<Session | null>(this.readSession());
  readonly user = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly signedIn = computed(() => !!this.session());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  async login(email: string, password: string): Promise<void> {
    if (environment.demo) {
      this.setSession(this.demoSession(email));
      return;
    }
    const session = await firstValueFrom(
      this.http.post<Session>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      }),
    );
    this.setSession(session);
  }

  async register(name: string, email: string, password: string): Promise<void> {
    if (environment.demo) {
      this.setSession(this.demoSession(email, name));
      return;
    }
    const session = await firstValueFrom(
      this.http.post<Session>(`${environment.apiUrl}/auth/register`, {
        name,
        email,
        password,
      }),
    );
    this.setSession(session);
  }

  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.session.set(null);
    void this.router.navigateByUrl('/login');
  }

  private demoSession(email: string, name = 'Amol'): Session {
    const clean = email.toLowerCase().trim();
    return {
      token: 'demo-token',
      user: { id: clean, email: clean, name },
    };
  }

  private setSession(session: Session): void {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    this.session.set(session);
  }

  private readSession(): Session | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) {
      return null;
    }
    try {
      return { token, user: JSON.parse(raw) as User };
    } catch {
      return null;
    }
  }
}
