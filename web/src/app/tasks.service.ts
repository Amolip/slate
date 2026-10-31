import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Task } from './models';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  list(): Promise<Task[]> {
    if (environment.demo) {
      return Promise.resolve(this.read());
    }
    return firstValueFrom(this.http.get<Task[]>(`${environment.apiUrl}/tasks`));
  }

  create(title: string, notes: string): Promise<Task> {
    if (environment.demo) {
      const task: Task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        notes: notes.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      };
      const next = [task, ...this.read()];
      this.write(next);
      return Promise.resolve(task);
    }
    return firstValueFrom(
      this.http.post<Task>(`${environment.apiUrl}/tasks`, { title, notes }),
    );
  }

  update(id: string, patch: Partial<Pick<Task, 'title' | 'notes' | 'done'>>): Promise<Task> {
    if (environment.demo) {
      const next = this.read().map((task) =>
        task.id === id ? { ...task, ...patch } : task,
      );
      this.write(next);
      const updated = next.find((task) => task.id === id);
      if (!updated) {
        return Promise.reject(new Error('Task not found'));
      }
      return Promise.resolve(updated);
    }
    return firstValueFrom(
      this.http.patch<Task>(`${environment.apiUrl}/tasks/${id}`, patch),
    );
  }

  remove(id: string): Promise<void> {
    if (environment.demo) {
      this.write(this.read().filter((task) => task.id !== id));
      return Promise.resolve();
    }
    return firstValueFrom(
      this.http.delete(`${environment.apiUrl}/tasks/${id}`),
    ).then(() => undefined);
  }

  private key(): string {
    const email = this.auth.user()?.email ?? 'guest';
    return `slate.tasks.${email}`;
  }

  private read(): Task[] {
    try {
      return JSON.parse(localStorage.getItem(this.key()) || '[]') as Task[];
    } catch {
      return [];
    }
  }

  private write(tasks: Task[]): void {
    localStorage.setItem(this.key(), JSON.stringify(tasks));
  }
}
