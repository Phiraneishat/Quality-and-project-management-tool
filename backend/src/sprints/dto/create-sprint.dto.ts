import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsNumber, IsArray } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty({ message: 'Sprint name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsString()
  @IsEnum(['Planning', 'Active', 'Review', 'Completed'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Start date is required' })
  startDate: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End date is required' })
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tasks?: string[];

  @IsNumber()
  @IsOptional()
  velocity?: number;
}
