import { Controller, Get, Post, Body, Put, Param, Query, UseGuards } from '@nestjs/common';
import { QualityService } from './quality.service';
import { CreateQualityMetricDto } from './dto/create-quality.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quality')
@UseGuards(JwtAuthGuard)
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Post()
  create(@Body() createQualityDto: CreateQualityMetricDto) {
    return this.qualityService.create(createQualityDto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.qualityService.findAll(projectId);
  }

  @Get('project/:projectId')
  getProjectHealth(@Param('projectId') projectId: string) {
    return this.qualityService.getProjectQualityHealth(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qualityService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQualityDto: any) {
    return this.qualityService.update(id, updateQualityDto);
  }
}
