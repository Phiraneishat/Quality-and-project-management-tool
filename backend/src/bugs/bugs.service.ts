import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bug } from '../schemas/bug.schema';
import { CreateBugDto } from './dto/create-bug.dto';

@Injectable()
export class BugsService {
  constructor(
    @InjectModel(Bug.name) private bugModel: Model<Bug>,
  ) {}

  async create(createBugDto: CreateBugDto, reporterId: string): Promise<Bug> {
    const createdBug = new this.bugModel({
      ...createBugDto,
      projectId: new Types.ObjectId(createBugDto.projectId),
      sprintId: createBugDto.sprintId ? new Types.ObjectId(createBugDto.sprintId) : undefined,
      assignedDev: createBugDto.assignedDev ? new Types.ObjectId(createBugDto.assignedDev) : undefined,
      reporter: new Types.ObjectId(reporterId),
    });
    return createdBug.save();
  }

  async findAll(projectId?: string): Promise<Bug[]> {
    const filter = projectId ? { projectId: new Types.ObjectId(projectId) } : {};
    return this.bugModel.find(filter)
      .populate('assignedDev', '-passwordHash')
      .populate('reporter', '-passwordHash')
      .exec();
  }

  async findOne(id: string): Promise<Bug> {
    const bug = await this.bugModel.findById(id)
      .populate('assignedDev', '-passwordHash')
      .populate('reporter', '-passwordHash')
      .exec();
    if (!bug) {
      throw new NotFoundException(`Bug with ID ${id} not found`);
    }
    return bug;
  }

  async update(id: string, updateBugDto: any): Promise<Bug> {
    const updateData = { ...updateBugDto };
    
    if (updateBugDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateBugDto.projectId);
    }
    if (updateBugDto.sprintId) {
      updateData.sprintId = new Types.ObjectId(updateBugDto.sprintId);
    }
    if (updateBugDto.assignedDev) {
      updateData.assignedDev = new Types.ObjectId(updateBugDto.assignedDev);
    }

    const bug = await this.bugModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('assignedDev', '-passwordHash')
      .populate('reporter', '-passwordHash')
      .exec();
    if (!bug) {
      throw new NotFoundException(`Bug with ID ${id} not found`);
    }
    return bug;
  }

  async remove(id: string): Promise<any> {
    const result = await this.bugModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bug with ID ${id} not found`);
    }
    return { message: 'Bug successfully deleted' };
  }

  async addComment(id: string, authorId: string, content: string): Promise<Bug> {
    const bug = await this.bugModel.findById(id).exec();
    if (!bug) {
      throw new NotFoundException(`Bug with ID ${id} not found`);
    }
    bug.comments.push({
      content,
      author: new Types.ObjectId(authorId) as any,
      mentions: [],
      createdAt: new Date(),
    });
    return bug.save();
  }
}
