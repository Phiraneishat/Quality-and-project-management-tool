import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from '../schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, reporterId: string): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      projectId: new Types.ObjectId(createTaskDto.projectId),
      sprintId: createTaskDto.sprintId ? new Types.ObjectId(createTaskDto.sprintId) : undefined,
      assignee: createTaskDto.assignee ? new Types.ObjectId(createTaskDto.assignee) : undefined,
      reporter: new Types.ObjectId(reporterId),
    });
    return createdTask.save();
  }

  async findAll(projectId?: string): Promise<Task[]> {
    const filter = projectId ? { projectId: new Types.ObjectId(projectId) } : {};
    return this.taskModel.find(filter)
      .populate('assignee', '-passwordHash')
      .populate('reporter', '-passwordHash')
      .exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id)
      .populate('assignee', '-passwordHash')
      .populate('reporter', '-passwordHash')
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: any): Promise<Task> {
    const updateData = { ...updateTaskDto };
    
    // Convert string IDs to Mongoose ObjectIds
    if (updateTaskDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateTaskDto.projectId);
    }
    if (updateTaskDto.sprintId) {
      updateData.sprintId = new Types.ObjectId(updateTaskDto.sprintId);
    }
    if (updateTaskDto.assignee) {
      updateData.assignee = new Types.ObjectId(updateTaskDto.assignee);
    }
    
    const task = await this.taskModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('assignee', '-passwordHash')
      .populate('reporter', '-passwordHash')
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async remove(id: string): Promise<any> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task successfully deleted` };
  }

  async addComment(id: string, authorId: string, content: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    task.comments.push({
      content,
      author: new Types.ObjectId(authorId) as any,
      mentions: [],
      createdAt: new Date(),
    });
    return task.save();
  }
}
