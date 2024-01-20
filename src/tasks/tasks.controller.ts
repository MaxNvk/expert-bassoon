import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('getTasks')
  getTasks(@Query() filterDto: GetTasksFilterDto): ITask[] {
    if (Object.keys(filterDto)?.length)
      return this.tasksService.getTasksWithFilters(filterDto);

    return this.tasksService.getAllTasks();
  }

  @Post('createTask')
  createTask(@Body() createTaskDto: CreateTaskDto): ITask {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('getTaskById')
  getTaskById(@Query('id') id: string): ITask {
    return this.tasksService.getTaskById(id);
  }

  @Post('deleteTask')
  deleteTask(@Body('id') id: string): void {
    return this.tasksService.deleteTask(id);
  }

  @Post('updateTask')
  updateTask(@Body() updateTaskDto: UpdateTaskDto): ITask {
    return this.tasksService.updateTask(updateTaskDto);
  }
}
