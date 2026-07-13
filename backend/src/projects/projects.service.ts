import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      createdBy: new Types.ObjectId(userId),
      teamMembers: createProjectDto.teamMembers?.map(id => new Types.ObjectId(id)) || [],
    });
    return createdProject.save();
  }

  async findAll(userId: string, role: string): Promise<Project[]> {
    if (role === 'Admin' || role === 'Project Manager') {
      return this.projectModel.find().populate('teamMembers', '-passwordHash').exec();
    }
    // Return projects where user is creator or team member
    return this.projectModel.find({
      $or: [
        { createdBy: new Types.ObjectId(userId) },
        { teamMembers: new Types.ObjectId(userId) }
      ]
    }).populate('teamMembers', '-passwordHash').exec();
  }

  async findOne(id: string, userId: string, role: string): Promise<Project> {
    const project = await this.projectModel.findById(id).populate('teamMembers', '-passwordHash').exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    // Authorization check
    if (role !== 'Admin' && role !== 'Project Manager') {
      const isMember = project.teamMembers.some(memberId => memberId.toString() === userId);
      const isCreator = project.createdBy.toString() === userId;
      if (!isMember && !isCreator) {
        throw new ForbiddenException('You do not have permission to view this project');
      }
    }
    
    return project;
  }

  async update(id: string, updateProjectDto: any, userId: string, role: string): Promise<Project> {
    const project = await this.findOne(id, userId, role); // validates exist & auth
    
    // Project Managers and Admins can update, or the creator
    if (role !== 'Admin' && role !== 'Project Manager' && project.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only Admins, PMs or the project creator can edit project details');
    }

    const updateData = { ...updateProjectDto };
    if (updateProjectDto.teamMembers) {
      updateData.teamMembers = updateProjectDto.teamMembers.map(mId => new Types.ObjectId(mId));
    }

    return this.projectModel.findByIdAndUpdate(id, updateData, { new: true }).populate('teamMembers', '-passwordHash').exec();
  }

  async remove(id: string, userId: string, role: string): Promise<any> {
    const project = await this.findOne(id, userId, role);
    if (role !== 'Admin' && role !== 'Project Manager' && project.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only Admins, PMs or the project creator can delete projects');
    }
    await this.projectModel.findByIdAndDelete(id).exec();
    return { message: `Project "${project.name}" has been successfully deleted` };
  }
}
