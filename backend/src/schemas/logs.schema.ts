import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ActivityLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['created', 'updated', 'deleted', 'assigned', 'commented', 'uploaded', 'status_changed'] })
  action: string;

  @Prop({ required: true })
  entity: string; // e.g. 'Project', 'Task', 'Bug', 'Sprint'

  @Prop({ type: Types.ObjectId, required: true })
  entityId: Types.ObjectId;

  @Prop({ required: true })
  entityName: string;

  @Prop()
  details?: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  action: string; // e.g. 'user_login', 'role_changed', 'database_backup', 'permissions_updated'

  @Prop({ required: true })
  details: string;

  @Prop({ default: 'Success' })
  status: string; // Success, Failed
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
