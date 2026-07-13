import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsEnum } from 'class-validator';

export class CreateTestCaseDto {
  @IsString()
  @IsNotEmpty({ message: 'TestCase title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'TestSuite ID is required' })
  suiteId: string;

  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  steps?: string[];

  @IsString()
  @IsNotEmpty({ message: 'Expected result is required' })
  expectedResult: string;

  @IsString()
  @IsOptional()
  actualResult?: string;

  @IsString()
  @IsEnum(['Passed', 'Failed', 'Blocked', 'Not Executed'])
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  isAutomated?: boolean;

  @IsString()
  @IsOptional()
  assignee?: string;
}
