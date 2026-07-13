import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class FileAttachment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  type: string;

  @Prop()
  size: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const FileAttachmentSchema = SchemaFactory.createForClass(FileAttachment);

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  mentions: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  taskId: string; // e.g. TSK-101

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  module?: string;

  @Prop({ required: true, enum: ['Urgent', 'High', 'Medium', 'Low'], default: 'Medium' })
  priority: string;

  @Prop({ required: true, enum: ['Todo', 'In Progress', 'In Review', 'Testing', 'Blocked', 'Completed'], default: 'Todo' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sprint' })
  sprintId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reporter?: Types.ObjectId;

  @Prop()
  startDate?: Date;

  @Prop()
  dueDate?: Date;

  @Prop({ default: 0 })
  estimatedHours: number;

  @Prop({ default: 0 })
  actualHours: number;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: [FileAttachmentSchema], default: [] })
  attachments: FileAttachment[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export { FileAttachmentSchema, CommentSchema };
