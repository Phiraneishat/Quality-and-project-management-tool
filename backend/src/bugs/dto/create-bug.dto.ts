import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateBugDto {
  @IsString()
  @IsNotEmpty({ message: 'Bug ID is required (e.g. BUG-001)' })
  bugId: string;

  @IsString()
  @IsNotEmpty({ message: 'Bug title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  screenshots?: string[];

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsOptional()
  sprintId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Module/component name is required' })
  module: string;

  @IsString()
  @IsEnum(['Critical', 'High', 'Medium', 'Low'])
  @IsOptional()
  severity?: string;

  @IsString()
  @IsEnum(['Urgent', 'High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  assignedDev?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsEnum(['Open', 'Assigned', 'In Progress', 'Ready for QA', 'Testing', 'Closed', 'Reopened'])
  @IsOptional()
  status?: string;
}
