import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileAttachment, FileAttachmentSchema, Comment, CommentSchema } from './task.schema';

@Schema({ timestamps: true })
export class Bug extends Document {
  @Prop({ required: true, unique: true })
  bugId: string; // e.g. BUG-101

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sprint' })
  sprintId?: Types.ObjectId;

  @Prop()
  module: string;

  @Prop({ required: true, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' })
  severity: string;

  @Prop({ required: true, enum: ['Urgent', 'High', 'Medium', 'Low'], default: 'Medium' })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedDev?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter: Types.ObjectId;

  @Prop()
  dueDate?: Date;

  @Prop({ required: true, enum: ['Open', 'Assigned', 'In Progress', 'Ready for QA', 'Testing', 'Closed', 'Reopened'], default: 'Open' })
  status: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: [FileAttachmentSchema], default: [] })
  attachments: FileAttachment[];
}

export const BugSchema = SchemaFactory.createForClass(Bug);
