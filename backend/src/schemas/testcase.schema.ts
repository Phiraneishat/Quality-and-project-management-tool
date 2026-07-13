import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TestCase extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'TestSuite', required: true })
  suiteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  steps: string[];

  @Prop({ required: true })
  expectedResult: string;

  @Prop()
  actualResult?: string;

  @Prop({ required: true, enum: ['Passed', 'Failed', 'Blocked', 'Not Executed'], default: 'Not Executed' })
  status: string;

  @Prop({ default: false })
  isAutomated: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee?: Types.ObjectId;
}

export const TestCaseSchema = SchemaFactory.createForClass(TestCase);

@Schema({ timestamps: true })
export class TestSuite extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'TestCase' }], default: [] })
  testCases: Types.ObjectId[];

  @Prop({ default: 0 })
  passRate: number;
}

export const TestSuiteSchema = SchemaFactory.createForClass(TestSuite);
