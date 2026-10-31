import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MemoryStore, TaskRecord } from '../store';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private readonly store: MemoryStore) {}

  list(userId: string): TaskRecord[] {
    return [...this.store.tasks.values()]
      .filter((task) => task.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  create(userId: string, dto: CreateTaskDto): TaskRecord {
    const task: TaskRecord = {
      id: randomUUID(),
      userId,
      title: dto.title.trim(),
      notes: dto.notes?.trim() ?? '',
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.store.tasks.set(task.id, task);
    return task;
  }

  update(userId: string, id: string, dto: UpdateTaskDto): TaskRecord {
    const task = this.requireOwned(userId, id);
    if (dto.title !== undefined) task.title = dto.title.trim();
    if (dto.notes !== undefined) task.notes = dto.notes.trim();
    if (dto.done !== undefined) task.done = dto.done;
    this.store.tasks.set(id, task);
    return task;
  }

  remove(userId: string, id: string): void {
    this.requireOwned(userId, id);
    this.store.tasks.delete(id);
  }

  private requireOwned(userId: string, id: string): TaskRecord {
    const task = this.store.tasks.get(id);
    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
