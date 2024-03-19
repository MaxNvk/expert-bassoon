import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from "@nestjs/passport";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('getTasks')
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Post('createTask')
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('getTaskById')
  getTaskById(@Query('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post('deleteTask')
  deleteTask(@Body('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Post('updateTask')
  updateTask(@Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.updateTask(updateTaskDto);
  }
}
