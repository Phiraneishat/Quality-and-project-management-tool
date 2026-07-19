import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileDocument } from '../schemas/file.schema';
import { UploadFileDto } from './dto/upload-file.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectModel(FileDocument.name) private fileModel: Model<FileDocument>,
  ) {
    // Ensure upload directory exists
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch (err) {
      console.warn(`Could not create uploads directory at ${this.uploadDir}, falling back to /tmp:`, err.message);
      this.uploadDir = path.join('/tmp', 'uploads');
      try {
        if (!fs.existsSync(this.uploadDir)) {
          fs.mkdirSync(this.uploadDir, { recursive: true });
        }
      } catch (tmpErr) {
        console.error('Failed to create fallback tmp upload directory:', tmpErr.message);
      }
    }
  }

  async upload(file: Express.Multer.File, dto: UploadFileDto, userId: string): Promise<FileDocument> {
    const filePath = path.join(this.uploadDir, `${Date.now()}-${file.originalname}`);
    fs.writeFileSync(filePath, file.buffer);

    const relativeUrl = `/uploads/${path.basename(filePath)}`;

    const newVersion = {
      versionNumber: 1,
      url: relativeUrl,
      size: file.size,
      uploadedBy: new Types.ObjectId(userId) as any,
      createdAt: new Date(),
    };

    const newFileDoc = new this.fileModel({
      name: file.originalname,
      mimeType: file.mimetype,
      projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : undefined,
      taskId: dto.taskId ? new Types.ObjectId(dto.taskId) : undefined,
      versions: [newVersion],
      currentVersion: 1,
      ownerId: new Types.ObjectId(userId),
    });

    return newFileDoc.save();
  }

  async addVersion(fileId: string, file: Express.Multer.File, userId: string): Promise<FileDocument> {
    const doc = await this.fileModel.findById(fileId).exec();
    if (!doc) {
      throw new NotFoundException(`File document with ID ${fileId} not found`);
    }

    const filePath = path.join(this.uploadDir, `${Date.now()}-${file.originalname}`);
    fs.writeFileSync(filePath, file.buffer);
    const relativeUrl = `/uploads/${path.basename(filePath)}`;

    const nextVersionNumber = doc.versions.length + 1;
    const nextVersion = {
      versionNumber: nextVersionNumber,
      url: relativeUrl,
      size: file.size,
      uploadedBy: new Types.ObjectId(userId) as any,
      createdAt: new Date(),
    };

    doc.versions.push(nextVersion);
    doc.currentVersion = nextVersionNumber;

    return doc.save();
  }

  async findAll(projectId?: string, taskId?: string): Promise<FileDocument[]> {
    const filter: any = {};
    if (projectId) filter.projectId = new Types.ObjectId(projectId);
    if (taskId) filter.taskId = new Types.ObjectId(taskId);
    return this.fileModel.find(filter).populate('ownerId', '-passwordHash').exec();
  }

  async findOne(id: string): Promise<FileDocument> {
    const doc = await this.fileModel.findById(id).populate('ownerId', '-passwordHash').exec();
    if (!doc) {
      throw new NotFoundException(`File record with ID ${id} not found`);
    }
    return doc;
  }

  async remove(id: string): Promise<any> {
    const doc = await this.findOne(id);
    
    // Delete files physically from uploads folder
    for (const version of doc.versions) {
      const fullPath = path.join(process.cwd(), version.url);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await this.fileModel.findByIdAndDelete(id).exec();
    return { message: 'File successfully deleted from system' };
  }
}
