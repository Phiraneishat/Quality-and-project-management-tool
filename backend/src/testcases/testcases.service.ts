import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TestCase, TestSuite } from '../schemas/testcase.schema';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { CreateTestSuiteDto } from './dto/create-testsuite.dto';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectModel(TestCase.name) private testCaseModel: Model<TestCase>,
    @InjectModel(TestSuite.name) private testSuiteModel: Model<TestSuite>,
  ) {}

  // ── Test Suite CRUD ──
  async createSuite(createSuiteDto: CreateTestSuiteDto): Promise<TestSuite> {
    const createdSuite = new this.testSuiteModel({
      ...createSuiteDto,
      projectId: new Types.ObjectId(createSuiteDto.projectId),
      testCases: [],
      passRate: 0,
    });
    return createdSuite.save();
  }

  async findAllSuites(projectId?: string): Promise<TestSuite[]> {
    const filter = projectId ? { projectId: new Types.ObjectId(projectId) } : {};
    return this.testSuiteModel.find(filter).populate('testCases').exec();
  }

  async findOneSuite(id: string): Promise<TestSuite> {
    const suite = await this.testSuiteModel.findById(id).populate('testCases').exec();
    if (!suite) {
      throw new NotFoundException(`TestSuite with ID ${id} not found`);
    }
    return suite;
  }

  // ── Test Case CRUD ──
  async createCase(createCaseDto: CreateTestCaseDto): Promise<TestCase> {
    const suite = await this.testSuiteModel.findById(createCaseDto.suiteId).exec();
    if (!suite) {
      throw new NotFoundException(`TestSuite with ID ${createCaseDto.suiteId} not found`);
    }

    const createdCase = new this.testCaseModel({
      ...createCaseDto,
      suiteId: new Types.ObjectId(createCaseDto.suiteId),
      projectId: new Types.ObjectId(createCaseDto.projectId),
      assignee: createCaseDto.assignee ? new Types.ObjectId(createCaseDto.assignee) : undefined,
    });
    const savedCase = await createdCase.save();

    // Push into suite and update passRate
    suite.testCases.push(savedCase._id as any);
    await suite.save();
    await this.updateSuitePassRate(suite._id.toString());

    return savedCase;
  }

  async findAllCases(suiteId?: string): Promise<TestCase[]> {
    const filter = suiteId ? { suiteId: new Types.ObjectId(suiteId) } : {};
    return this.testCaseModel.find(filter).populate('assignee', '-passwordHash').exec();
  }

  async findOneCase(id: string): Promise<TestCase> {
    const tc = await this.testCaseModel.findById(id).populate('assignee', '-passwordHash').exec();
    if (!tc) {
      throw new NotFoundException(`TestCase with ID ${id} not found`);
    }
    return tc;
  }

  async updateCase(id: string, updateCaseDto: any): Promise<TestCase> {
    const updateData = { ...updateCaseDto };
    if (updateCaseDto.suiteId) {
      updateData.suiteId = new Types.ObjectId(updateCaseDto.suiteId);
    }
    if (updateCaseDto.projectId) {
      updateData.projectId = new Types.ObjectId(updateCaseDto.projectId);
    }
    if (updateCaseDto.assignee) {
      updateData.assignee = new Types.ObjectId(updateCaseDto.assignee);
    }

    const updated = await this.testCaseModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`TestCase with ID ${id} not found`);
    }

    // Trigger passRate update on suite
    await this.updateSuitePassRate(updated.suiteId.toString());
    return updated;
  }

  async removeCase(id: string): Promise<any> {
    const tc = await this.testCaseModel.findByIdAndDelete(id).exec();
    if (!tc) {
      throw new NotFoundException(`TestCase with ID ${id} not found`);
    }

    // Pull from suite
    await this.testSuiteModel.findByIdAndUpdate(tc.suiteId, {
      $pull: { testCases: tc._id }
    }).exec();

    await this.updateSuitePassRate(tc.suiteId.toString());
    return { message: 'TestCase successfully deleted' };
  }

  // Helper function to update test suite pass rate automatically
  private async updateSuitePassRate(suiteId: string): Promise<void> {
    const suite = await this.testSuiteModel.findById(suiteId).exec();
    if (!suite) return;

    const cases = await this.testCaseModel.find({ suiteId: new Types.ObjectId(suiteId) }).exec();
    if (cases.length === 0) {
      suite.passRate = 0;
      await suite.save();
      return;
    }

    const passedCount = cases.filter(c => c.status === 'Passed').length;
    suite.passRate = Math.round((passedCount / cases.length) * 100);
    await suite.save();
  }
}
