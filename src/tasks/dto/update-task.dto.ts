import { ETaskStatus } from '../task-status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;

  @IsOptional()
  @IsEnum(ETaskStatus)
  status?: ETaskStatus;
}
