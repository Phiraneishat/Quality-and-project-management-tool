import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileDocument, FileDocumentSchema } from '../schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileDocument.name, schema: FileDocumentSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
