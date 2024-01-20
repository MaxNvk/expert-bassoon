import { Injectable, NotFoundException } from '@nestjs/common';
import { ETaskStatus, ITask } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters({ status, search }: GetTasksFilterDto): ITask[] {
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  createTask({ title, description }: CreateTaskDto): ITask {
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: ETaskStatus.Open,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): ITask {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) throw new NotFoundException(`Task with ID '${id}' not found.`);

    return found;
  }

  deleteTask(id: string): void {
    this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTask({ id, ...fieldsToUpdate }: UpdateTaskDto): ITask {
    const task = this.getTaskById(id);

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      task[key] = value;
    });

    return task;
  }
}
