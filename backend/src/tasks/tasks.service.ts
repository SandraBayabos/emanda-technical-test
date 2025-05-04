import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private tasksRepo: Repository<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    if (createTaskDto.parentId) {
      task.parent = (await this.tasksRepo.findOneBy({ id: createTaskDto.parentId })) ?? undefined;
    }
    return this.tasksRepo.save(task);
  }

  async findAll(): Promise<Task[]> {
    // Only return top-level tasks
    return this.tasksRepo.find({ where: { parent: IsNull() } });
  }

  async findSubtasks(parentId: number): Promise<Task[]> {
    return this.tasksRepo.find({ where: { parent: { id: parentId } } });
  }
}
