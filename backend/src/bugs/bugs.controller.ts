import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { BugsService } from './bugs.service';
import { CreateBugDto } from './dto/create-bug.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bugs')
@UseGuards(JwtAuthGuard)
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Post()
  create(@Body() createBugDto: CreateBugDto, @Request() req) {
    return this.bugsService.create(createBugDto, req.user._id);
  }

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.bugsService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bugsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBugDto: any) {
    return this.bugsService.update(id, updateBugDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bugsService.remove(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.bugsService.addComment(id, req.user._id, content);
  }
}
