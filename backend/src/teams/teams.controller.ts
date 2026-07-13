import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // ── Departments ──
  @Post('departments')
  createDept(@Body() createDeptDto: CreateDepartmentDto) {
    return this.teamsService.createDept(createDeptDto);
  }

  @Get('departments')
  findAllDepts() {
    return this.teamsService.findAllDepts();
  }

  // ── Teams ──
  @Post()
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Get()
  findAllTeams(@Query('departmentId') departmentId?: string) {
    return this.teamsService.findAllTeams(departmentId);
  }

  @Get(':id')
  findOneTeam(@Param('id') id: string) {
    return this.teamsService.findOneTeam(id);
  }

  @Put(':id')
  updateTeam(@Param('id') id: string, @Body() updateTeamDto: any) {
    return this.teamsService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  removeTeam(@Param('id') id: string) {
    return this.teamsService.removeTeam(id);
  }
}
