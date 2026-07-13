import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('activity')
  getActivityLogs(
    @Query('entity') entity?: string,
    @Query('entityId') entityId?: string,
  ) {
    return this.logsService.getActivityLogs(entity, entityId);
  }

  @Get('audit')
  @Roles('Admin')
  getAuditLogs() {
    return this.logsService.getAuditLogs();
  }
}
