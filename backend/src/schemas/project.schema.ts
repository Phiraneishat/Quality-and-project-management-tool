import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Milestone {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: false })
  isCompleted: boolean;
}

const MilestoneSchema = SchemaFactory.createForClass(Milestone);

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['Planning', 'Design', 'Development', 'Testing', 'Review', 'Deployment', 'Completed', 'Archived'], default: 'Planning' })
  status: string;

  @Prop({ required: true, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' })
  priority: string;

  @Prop({ required: true, enum: ['High', 'Medium', 'Low'], default: 'Low' })
  riskLevel: string;

  @Prop({ default: 0 })
  budget: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  teamMembers: Types.ObjectId[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [MilestoneSchema], default: [] })
  milestones: Milestone[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
