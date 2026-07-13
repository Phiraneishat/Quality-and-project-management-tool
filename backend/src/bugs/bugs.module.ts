import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BugsService } from './bugs.service';
import { BugsController } from './bugs.controller';
import { Bug, BugSchema } from '../schemas/bug.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bug.name, schema: BugSchema }]),
  ],
  controllers: [BugsController],
  providers: [BugsService],
  exports: [BugsService],
})
export class BugsModule {}
