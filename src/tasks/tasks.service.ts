import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { ITaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: ITaskRepository,
  ) {}
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });

    if (!found) throw new NotFoundException(`Task with ID '${id}' not found.`);

    return found;
  }
  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected) return;

    throw new NotFoundException(`Task with ID '${id}' not found.`);
  }

  async updateTask({ id, ...fieldsToUpdate }: UpdateTaskDto): Promise<Task> {
    let task = await this.getTaskById(id);

    task = {
      ...task,
      ...fieldsToUpdate,
    };

    await this.tasksRepository.save(task);

    return task;
  }
}
