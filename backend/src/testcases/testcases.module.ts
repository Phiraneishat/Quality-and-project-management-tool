import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestCasesService } from './testcases.service';
import { TestCasesController } from './testcases.controller';
import { TestCase, TestCaseSchema, TestSuite, TestSuiteSchema } from '../schemas/testcase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestCase.name, schema: TestCaseSchema },
      { name: TestSuite.name, schema: TestSuiteSchema },
    ]),
  ],
  controllers: [TestCasesController],
  providers: [TestCasesService],
  exports: [TestCasesService],
})
export class TestCasesModule {}
