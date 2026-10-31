import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthUser, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  list(@Req() request: { user: AuthUser }) {
    return this.tasks.list(request.user.sub);
  }

  @Post()
  create(@Req() request: { user: AuthUser }, @Body() dto: CreateTaskDto) {
    return this.tasks.create(request.user.sub, dto);
  }

  @Patch(':id')
  update(
    @Req() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(request.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() request: { user: AuthUser }, @Param('id') id: string) {
    this.tasks.remove(request.user.sub, id);
    return { ok: true };
  }
}
