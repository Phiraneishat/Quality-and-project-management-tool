import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateQualityMetricDto {
  @IsString()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  @IsString()
  @IsOptional()
  sprintId?: string;

  @IsNumber()
  @IsOptional()
  qualityScore?: number;

  @IsNumber()
  @IsOptional()
  codeCoverage?: number;

  @IsNumber()
  @IsOptional()
  requirementCoverage?: number;

  @IsNumber()
  @IsOptional()
  testCoverage?: number;

  @IsNumber()
  @IsOptional()
  reviewScore?: number;

  @IsNumber()
  @IsOptional()
  bugDensity?: number;

  @IsNumber()
  @IsOptional()
  defectLeakage?: number;

  @IsNumber()
  @IsOptional()
  customerSatisfaction?: number;

  @IsNumber()
  @IsOptional()
  reopenedBugs?: number;

  @IsNumber()
  @IsOptional()
  failedBuilds?: number;

  @IsString()
  @IsEnum(['Excellent', 'Good', 'Average', 'Poor'])
  @IsOptional()
  qualityStatus?: string;
}
// 
