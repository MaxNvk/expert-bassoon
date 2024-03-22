import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ETaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export interface ITaskRepository extends Repository<Task> {
  this: Repository<Task>;
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
  createTask(payload: CreateTaskDto, user: User): Promise<Task>;
}
export const TasksRepository: Pick<ITaskRepository, any> = {
  async getTasks(
    { status, search }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const logger = new Logger('TasksRepository', { timestamp: this });

    const query = this.createQueryBuilder('task');

    query.andWhere({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();

      return tasks;
    } catch (error) {
      logger.error(
        `Failed to get tasks for user "${user.username}"`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  },
  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: ETaskStatus.Open,
      user,
    });

    await this.save(task);

    return task;
  },
};
