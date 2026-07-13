import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTestSuiteDto {
  @IsString()
  @IsNotEmpty({ message: 'TestSuite name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;
}
