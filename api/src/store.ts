import { Injectable } from '@nestjs/common';

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

export type TaskRecord = {
  id: string;
  userId: string;
  title: string;
  notes: string;
  done: boolean;
  createdAt: string;
};

@Injectable()
export class MemoryStore {
  readonly users = new Map<string, UserRecord>();
  readonly tasks = new Map<string, TaskRecord>();
}
