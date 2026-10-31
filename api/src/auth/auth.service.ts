import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { MemoryStore } from '../store';
import { LoginDto, RegisterDto } from './dto';
import { hashPassword, verifyPassword } from './password';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly store: MemoryStore,
    private readonly jwt: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    const email = 'demo@slate.app';
    if ([...this.store.users.values()].some((user) => user.email === email)) {
      return;
    }
    const id = randomUUID();
    this.store.users.set(id, {
      id,
      email,
      name: 'Amol',
      passwordHash: await hashPassword('slate1234'),
    });
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    if ([...this.store.users.values()].some((user) => user.email === email)) {
      throw new ConflictException('An account with that email already exists');
    }
    const id = randomUUID();
    this.store.users.set(id, {
      id,
      email,
      name: dto.name.trim(),
      passwordHash: await hashPassword(dto.password),
    });
    return this.issue(id, email, dto.name.trim());
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = [...this.store.users.values()].find(
      (item) => item.email === email,
    );
    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return this.issue(user.id, user.email, user.name);
  }

  profile(userId: string) {
    const user = this.store.users.get(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, name: user.name };
  }

  private issue(id: string, email: string, name: string) {
    const token = this.jwt.sign({ sub: id, email, name });
    return {
      token,
      user: { id, email, name },
    };
  }
}
