import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class QualityMetric extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sprint' })
  sprintId?: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  qualityScore: number;

  @Prop({ required: true, default: 0 })
  codeCoverage: number;

  @Prop({ required: true, default: 0 })
  requirementCoverage: number;

  @Prop({ required: true, default: 0 })
  testCoverage: number;

  @Prop({ required: true, default: 0 })
  reviewScore: number;

  @Prop({ required: true, default: 0 })
  bugDensity: number;

  @Prop({ required: true, default: 0 })
  defectLeakage: number;

  @Prop({ required: true, default: 0 })
  customerSatisfaction: number;

  @Prop({ required: true, default: 0 })
  reopenedBugs: number;

  @Prop({ required: true, default: 0 })
  failedBuilds: number;

  @Prop({ required: true, enum: ['Excellent', 'Good', 'Average', 'Poor'], default: 'Average' })
  qualityStatus: string;
}

export const QualityMetricSchema = SchemaFactory.createForClass(QualityMetric);
