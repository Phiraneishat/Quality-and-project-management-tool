import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QualityService } from './quality.service';
import { QualityController } from './quality.controller';
import { QualityMetric, QualityMetricSchema } from '../schemas/quality.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: QualityMetric.name, schema: QualityMetricSchema }]),
  ],
  controllers: [QualityController],
  providers: [QualityService],
  exports: [QualityService],
})
export class QualityModule {}
// 
