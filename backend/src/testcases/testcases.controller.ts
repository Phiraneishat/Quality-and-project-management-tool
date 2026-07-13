import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TestCasesService } from './testcases.service';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { CreateTestSuiteDto } from './dto/create-testsuite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('test-cases')
@UseGuards(JwtAuthGuard)
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  // ── Suites ──
  @Post('suites')
  createSuite(@Body() createSuiteDto: CreateTestSuiteDto) {
    return this.testCasesService.createSuite(createSuiteDto);
  }

  @Get('suites')
  findAllSuites(@Query('projectId') projectId?: string) {
    return this.testCasesService.findAllSuites(projectId);
  }

  @Get('suites/:id')
  findOneSuite(@Param('id') id: string) {
    return this.testCasesService.findOneSuite(id);
  }

  // ── Cases ──
  @Post()
  createCase(@Body() createCaseDto: CreateTestCaseDto) {
    return this.testCasesService.createCase(createCaseDto);
  }

  @Get()
  findAllCases(@Query('suiteId') suiteId?: string) {
    return this.testCasesService.findAllCases(suiteId);
  }

  @Get(':id')
  findOneCase(@Param('id') id: string) {
    return this.testCasesService.findOneCase(id);
  }

  @Put(':id')
  updateCase(@Param('id') id: string, @Body() updateCaseDto: any) {
    return this.testCasesService.updateCase(id, updateCaseDto);
  }

  @Delete(':id')
  removeCase(@Param('id') id: string) {
    return this.testCasesService.removeCase(id);
  }
}
