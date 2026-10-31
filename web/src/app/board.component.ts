import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { Task } from './models';
import { TasksService } from './tasks.service';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-board',
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly tasksApi = inject(TasksService);
  readonly demo = environment.demo;
  readonly user = this.auth.user;
  readonly tasks = signal<Task[]>([]);
  readonly openCount = computed(
    () => this.tasks().filter((task) => !task.done).length,
  );
  title = '';
  notes = '';
  error = signal('');
  loading = signal(true);
  leavingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.refresh();
  }

  async add(): Promise<void> {
    const title = this.title.trim();
    if (!title) return;
    this.error.set('');
    try {
      const task = await this.tasksApi.create(title, this.notes);
      this.tasks.update((list) => [task, ...list]);
      this.title = '';
      this.notes = '';
    } catch {
      this.error.set('Could not add that task.');
    }
  }

  async toggle(task: Task): Promise<void> {
    const updated = await this.tasksApi.update(task.id, { done: !task.done });
    this.tasks.update((list) =>
      list.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  async remove(task: Task): Promise<void> {
    this.leavingId.set(task.id);
    await new Promise((resolve) => setTimeout(resolve, 220));
    await this.tasksApi.remove(task.id);
    this.tasks.update((list) => list.filter((item) => item.id !== task.id));
    this.leavingId.set(null);
  }

  signOut(): void {
    this.auth.signOut();
  }

  private async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      this.tasks.set(await this.tasksApi.list());
    } catch {
      this.error.set('Could not load tasks.');
    } finally {
      this.loading.set(false);
    }
  }
}
