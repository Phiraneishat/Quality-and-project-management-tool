import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sprint } from '../schemas/sprint.schema';
import { CreateSprintDto } from './dto/create-sprint.dto';

@Injectable()
export class SprintsService {
  constructor(
    @InjectModel(Sprint.name) private sprintModel: Model<Sprint>,
  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const createdSprint = new this.sprintModel({
      ...createSprintDto,
      projectId: new Types.ObjectId(createSprintDto.projectId),
      tasks: createSprintDto.tasks?.map(id => new Types.ObjectId(id)) || [],
    });
    return createdSprint.save();
  }

  async findAll(projectId?: string): Promise<Sprint[]> {
    const filter = projectId ? { projectId: new Types.ObjectId(projectId) } : {};
    return this.sprintModel.find(filter).populate('tasks').exec();
  }

  async findOne(id: string): Promise<Sprint> {
    const sprint = await this.sprintModel.findById(id).populate('tasks').exec();
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async update(id: string, updateSprintDto: any): Promise<Sprint> {
    const updateData = { ...updateSprintDto };
    if (updateSprintDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateSprintDto.projectId);
    }
    if (updateSprintDto.tasks) {
      updateData.tasks = updateSprintDto.tasks.map(tId => new Types.ObjectId(tId));
    }

    const sprint = await this.sprintModel.findByIdAndUpdate(id, updateData, { new: true }).populate('tasks').exec();
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async remove(id: string): Promise<any> {
    const result = await this.sprintModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return { message: 'Sprint successfully deleted' };
  }
}
