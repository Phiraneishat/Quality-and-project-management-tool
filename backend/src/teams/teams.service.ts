import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team, Department } from '../schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Department.name) private deptModel: Model<Department>,
  ) {}

  // ── Department CRUD ──
  async createDept(createDeptDto: CreateDepartmentDto): Promise<Department> {
    const existing = await this.deptModel.findOne({ name: createDeptDto.name }).exec();
    if (existing) {
      throw new ConflictException(`Department with name ${createDeptDto.name} already exists`);
    }
    const created = new this.deptModel({
      ...createDeptDto,
      headId: createDeptDto.headId ? new Types.ObjectId(createDeptDto.headId) : undefined,
    });
    return created.save();
  }

  async findAllDepts(): Promise<Department[]> {
    return this.deptModel.find().populate('headId', '-passwordHash').exec();
  }

  // ── Team CRUD ──
  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const existing = await this.teamModel.findOne({ name: createTeamDto.name }).exec();
    if (existing) {
      throw new ConflictException(`Team with name ${createTeamDto.name} already exists`);
    }

    const created = new this.teamModel({
      ...createTeamDto,
      leadId: new Types.ObjectId(createTeamDto.leadId),
      departmentId: createTeamDto.departmentId ? new Types.ObjectId(createTeamDto.departmentId) : undefined,
      members: createTeamDto.members?.map(id => new Types.ObjectId(id)) || [],
    });
    return created.save();
  }

  async findAllTeams(departmentId?: string): Promise<Team[]> {
    const filter = departmentId ? { departmentId: new Types.ObjectId(departmentId) } : {};
    return this.teamModel.find(filter)
      .populate('leadId', '-passwordHash')
      .populate('members', '-passwordHash')
      .populate('departmentId')
      .exec();
  }

  async findOneTeam(id: string): Promise<Team> {
    const team = await this.teamModel.findById(id)
      .populate('leadId', '-passwordHash')
      .populate('members', '-passwordHash')
      .populate('departmentId')
      .exec();
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async updateTeam(id: string, updateTeamDto: any): Promise<Team> {
    const updateData = { ...updateTeamDto };
    
    if (updateTeamDto.leadId) {
      updateData.leadId = new Types.ObjectId(updateTeamDto.leadId);
    }
    if (updateTeamDto.departmentId) {
      updateData.departmentId = new Types.ObjectId(updateTeamDto.departmentId);
    }
    if (updateTeamDto.members) {
      updateData.members = updateTeamDto.members.map(mId => new Types.ObjectId(mId));
    }

    const updated = await this.teamModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate('leadId', '-passwordHash')
      .populate('members', '-passwordHash')
      .exec();
    
    if (!updated) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return updated;
  }

  async removeTeam(id: string): Promise<any> {
    const result = await this.teamModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return { message: 'Team successfully deleted' };
  }
}
