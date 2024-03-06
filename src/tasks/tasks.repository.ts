import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ETaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export interface ITaskRepository extends Repository<Task> {
  this: Repository<Task>;
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>;
  createTask(payload: CreateTaskDto): Promise<Task>;
}
export const TasksRepository: Pick<ITaskRepository, any> = {
  async getTasks({ status, search }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  },
  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: ETaskStatus.Open,
    });

    await this.save(task);

    return task;
  },
};
