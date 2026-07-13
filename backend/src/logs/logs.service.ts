import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityLog, AuditLog } from '../schemas/logs.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(ActivityLog.name) private actModel: Model<ActivityLog>,
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLog>,
  ) {}

  async createActivityLog(
    userId: string,
    action: 'created' | 'updated' | 'deleted' | 'assigned' | 'commented' | 'uploaded' | 'status_changed',
    entity: string,
    entityId: string,
    entityName: string,
    details?: string,
  ): Promise<ActivityLog> {
    const log = new this.actModel({
      userId: new Types.ObjectId(userId),
      action,
      entity,
      entityId: new Types.ObjectId(entityId),
      entityName,
      details,
    });
    return log.save();
  }

  async createAuditLog(
    userId: string,
    ipAddress: string,
    action: string,
    details: string,
    status: 'Success' | 'Failed' = 'Success',
  ): Promise<AuditLog> {
    const log = new this.auditModel({
      userId: new Types.ObjectId(userId),
      ipAddress,
      action,
      details,
      status,
    });
    return log.save();
  }

  async getActivityLogs(entity?: string, entityId?: string): Promise<ActivityLog[]> {
    const filter: any = {};
    if (entity) filter.entity = entity;
    if (entityId) filter.entityId = new Types.ObjectId(entityId);
    return this.actModel.find(filter).populate('userId', '-passwordHash').sort({ createdAt: -1 }).exec();
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditModel.find().populate('userId', '-passwordHash').sort({ createdAt: -1 }).exec();
  }
}
