import { ETaskStatus } from '../task.model';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;

  @IsOptional()
  @IsEnum(ETaskStatus)
  status?: ETaskStatus;
}
