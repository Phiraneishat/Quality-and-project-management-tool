import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsEnum(['Planning', 'Design', 'Development', 'Testing', 'Review', 'Deployment', 'Completed', 'Archived'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsEnum(['Critical', 'High', 'Medium', 'Low'])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsEnum(['High', 'Medium', 'Low'])
  @IsOptional()
  riskLevel?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teamMembers?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
