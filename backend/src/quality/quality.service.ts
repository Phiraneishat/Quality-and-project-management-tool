import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QualityMetric } from '../schemas/quality.schema';
import { CreateQualityMetricDto } from './dto/create-quality.dto';

@Injectable()
export class QualityService {
  constructor(
    @InjectModel(QualityMetric.name) private qualityModel: Model<QualityMetric>,
  ) {}

  // Professional algorithm to compute overall quality score
  private calculateMetrics(dto: CreateQualityMetricDto) {
    const code = dto.codeCoverage ?? 80;
    const req = dto.requirementCoverage ?? 90;
    const test = dto.testCoverage ?? 85;
    const review = dto.reviewScore ?? 4.0; // max 5
    const satisfaction = dto.customerSatisfaction ?? 4.5; // max 5
    const leakage = dto.defectLeakage ?? 2.0; // lower is better
    const reopened = dto.reopenedBugs ?? 3.0; // lower is better
    
    // Normalize weights out of 100
    const codePart = code * 0.20; // 20% weight
    const reqPart = req * 0.20; // 20% weight
    const testPart = test * 0.20; // 20% weight
    const reviewPart = (review / 5) * 100 * 0.10; // 10% weight
    const satisfactionPart = (satisfaction / 5) * 100 * 0.10; // 10% weight
    const leakagePart = Math.max(0, 100 - (leakage * 10)) * 0.10; // 10% weight (re-scaled leakage)
    const reopenedPart = Math.max(0, 100 - (reopened * 10)) * 0.10; // 10% weight (re-scaled reopened)

    const finalScore = Math.round(codePart + reqPart + testPart + reviewPart + satisfactionPart + leakagePart + reopenedPart);
    
    let finalStatus = 'Average';
    if (finalScore >= 90) finalStatus = 'Excellent';
    else if (finalScore >= 70) finalStatus = 'Good';
    else if (finalScore >= 50) finalStatus = 'Average';
    else finalStatus = 'Poor';

    return { score: finalScore, status: finalStatus };
  }

  async create(createQualityDto: CreateQualityMetricDto): Promise<QualityMetric> {
    const { score, status } = this.calculateMetrics(createQualityDto);

    const createdMetric = new this.qualityModel({
      ...createQualityDto,
      projectId: new Types.ObjectId(createQualityDto.projectId),
      sprintId: createQualityDto.sprintId ? new Types.ObjectId(createQualityDto.sprintId) : undefined,
      qualityScore: score,
      qualityStatus: status,
    });
    return createdMetric.save();
  }

  async findAll(projectId?: string): Promise<QualityMetric[]> {
    const filter = projectId ? { projectId: new Types.ObjectId(projectId) } : {};
    return this.qualityModel.find(filter).exec();
  }

  async findOne(id: string): Promise<QualityMetric> {
    const metric = await this.qualityModel.findById(id).exec();
    if (!metric) {
      throw new NotFoundException(`Quality Metric record with ID ${id} not found`);
    }
    return metric;
  }

  async update(id: string, updateQualityDto: any): Promise<QualityMetric> {
    const current = await this.findOne(id);
    const merged = { ...current.toObject(), ...updateQualityDto };
    
    const { score, status } = this.calculateMetrics(merged);
    
    const updateData = {
      ...updateQualityDto,
      qualityScore: score,
      qualityStatus: status,
    };

    if (updateQualityDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateQualityDto.projectId);
    }
    if (updateQualityDto.sprintId) {
      updateData.sprintId = new Types.ObjectId(updateQualityDto.sprintId);
    }

    const updated = await this.qualityModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Quality Metric record with ID ${id} not found`);
    }
    return updated;
  }

  async getProjectQualityHealth(projectId: string): Promise<any> {
    const metrics = await this.findAll(projectId);
    if (metrics.length === 0) {
      return { score: 0, status: 'No Data' };
    }
    // Return latest entry
    const latest = metrics[metrics.length - 1];
    return {
      score: latest.qualityScore,
      status: latest.qualityStatus,
      historical: metrics,
    };
  }
}
