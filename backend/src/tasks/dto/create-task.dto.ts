import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task ID is required (e.g. TSK-101)' })
  taskId: string;

  @IsString()
  @IsNotEmpty({ message: 'Task name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  module?: string;

  @IsString()
  @IsEnum(['Urgent', 'High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsEnum(['Todo', 'In Progress', 'In Review', 'Testing', 'Blocked', 'Completed'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsOptional()
  sprintId?: string;

  @IsString()
  @IsOptional()
  assignee?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @IsOptional()
  actualHours?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];
}
