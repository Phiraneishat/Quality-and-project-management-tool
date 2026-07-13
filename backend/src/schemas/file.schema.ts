import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class FileVersion {
  @Prop({ required: true })
  versionNumber: number;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;
}

export const FileVersionSchema = SchemaFactory.createForClass(FileVersion);

@Schema({ timestamps: true })
export class FileDocument extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  taskId?: Types.ObjectId;

  @Prop({ type: [FileVersionSchema], default: [] })
  versions: FileVersion[];

  @Prop({ required: true, default: 1 })
  currentVersion: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [String], enum: ['Read', 'Write', 'All'], default: ['All'] })
  permissions: string[];
}

export const FileDocumentSchema = SchemaFactory.createForClass(FileDocument);
