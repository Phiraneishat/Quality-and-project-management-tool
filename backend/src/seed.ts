import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Project } from './schemas/project.schema';
import { Task } from './schemas/task.schema';
import { Bug } from './schemas/bug.schema';
import { QualityMetric } from './schemas/quality.schema';
import { TestCase, TestSuite } from './schemas/testcase.schema';
import { Team, Department } from './schemas/team.schema';

async function bootstrap() {
  console.log('Starting QualityDesk Database Seeding...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const projectModel = app.get<Model<Project>>(getModelToken(Project.name));
  const taskModel = app.get<Model<Task>>(getModelToken(Task.name));
  const bugModel = app.get<Model<Bug>>(getModelToken(Bug.name));
  const qualityModel = app.get<Model<QualityMetric>>(getModelToken(QualityMetric.name));
  const tcModel = app.get<Model<TestCase>>(getModelToken(TestCase.name));
  const suiteModel = app.get<Model<TestSuite>>(getModelToken(TestSuite.name));
  const teamModel = app.get<Model<Team>>(getModelToken(Team.name));
  const deptModel = app.get<Model<Department>>(getModelToken(Department.name));

  // 1. Clear Existing Data
  console.log('Clearing existing data...');
  await userModel.deleteMany({});
  await projectModel.deleteMany({});
  await taskModel.deleteMany({});
  await bugModel.deleteMany({});
  await qualityModel.deleteMany({});
  await tcModel.deleteMany({});
  await suiteModel.deleteMany({});
  await teamModel.deleteMany({});
  await deptModel.deleteMany({});

  // 2. Create Users
  console.log('Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await new userModel({
    name: 'Phira Admin',
    email: 'admin@qualitydesk.io',
    passwordHash,
    role: 'Admin',
    department: 'Management',
    isVerified: true,
  }).save();

  const pm = await new userModel({
    name: 'Sarah Chen',
    email: 'pm@qualitydesk.io',
    passwordHash,
    role: 'Project Manager',
    department: 'Product',
    isVerified: true,
  }).save();

  const dev1 = await new userModel({
    name: 'Raj Patel',
    email: 'dev@qualitydesk.io',
    passwordHash,
    role: 'Developer',
    department: 'Engineering',
    isVerified: true,
  }).save();

  const dev2 = await new userModel({
    name: 'Emma Wilson',
    email: 'emma@qualitydesk.io',
    passwordHash,
    role: 'Developer',
    department: 'Engineering',
    isVerified: true,
  }).save();

  const qa = await new userModel({
    name: 'Charlie Brown',
    email: 'qa@qualitydesk.io',
    passwordHash,
    role: 'QA Tester',
    department: 'Quality Assurance',
    isVerified: true,
  }).save();

  const lead = await new userModel({
    name: 'Marcus Webb',
    email: 'lead@qualitydesk.io',
    passwordHash,
    role: 'Team Lead',
    department: 'Engineering',
    isVerified: true,
  }).save();

  const client = await new userModel({
    name: 'James Carter',
    email: 'client@qualitydesk.io',
    passwordHash,
    role: 'Client',
    department: 'External',
    isVerified: true,
  }).save();

  // 3. Create Departments & Teams
  console.log('Seeding Departments & Teams...');
  const engDept = await new deptModel({ name: 'Engineering', headId: admin._id }).save();
  const qaDept = await new deptModel({ name: 'Quality Assurance', headId: qa._id }).save();

  const devTeam = await new teamModel({
    name: 'Core Developers',
    description: 'Responsible for backend scaling & UI development',
    leadId: pm._id,
    members: [dev1._id, dev2._id],
    departmentId: engDept._id,
  }).save();

  const qaTeam = await new teamModel({
    name: 'QA Automation',
    description: 'Handles unit, E2E, and regression test suites',
    leadId: qa._id,
    members: [dev2._id],
    departmentId: qaDept._id,
  }).save();

  // 4. Create Projects
  console.log('Seeding Projects...');
  const proj1 = await new projectModel({
    name: 'E-Commerce Platform v3',
    description: 'Full redesign of the shopping experience with AI recommendations.',
    status: 'Development',
    priority: 'High',
    riskLevel: 'Medium',
    budget: 85000,
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-08-30'),
    progress: 68,
    teamMembers: [dev1._id, dev2._id, qa._id],
    tags: ['React', 'NestJS', 'MongoDB'],
    createdBy: pm._id,
    milestones: [
      { title: 'Database Design', description: 'Complete Mongoose models', dueDate: new Date('2026-06-15'), isCompleted: true },
      { title: 'Auth Service', description: 'JWT & login validation', dueDate: new Date('2026-07-10'), isCompleted: false },
      { title: 'Payment Gateways', description: 'Stripe integration', dueDate: new Date('2026-08-01'), isCompleted: false },
    ],
  }).save();

  const proj2 = await new projectModel({
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric auth.',
    status: 'Testing',
    priority: 'Critical',
    riskLevel: 'Low',
    budget: 120000,
    startDate: new Date('2026-05-10'),
    endDate: new Date('2026-07-25'),
    progress: 85,
    teamMembers: [dev1._id, qa._id],
    tags: ['React Native', 'Firebase'],
    createdBy: pm._id,
    milestones: [
      { title: 'Biometrics integration', description: 'FaceID / fingerprint login', dueDate: new Date('2026-06-20'), isCompleted: true },
      { title: 'Security audits', description: 'Penetration testing', dueDate: new Date('2026-07-15'), isCompleted: false },
    ],
  }).save();

  // 5. Create Tasks
  console.log('Seeding Tasks...');
  await new taskModel({
    taskId: 'TSK-101',
    name: 'Implement JWT auth strategy',
    description: 'Set up JWT passport validation and guards.',
    priority: 'High',
    status: 'Todo',
    projectId: proj1._id,
    assignee: dev1._id,
    reporter: pm._id,
    startDate: new Date('2026-07-05'),
    dueDate: new Date('2026-07-12'),
    estimatedHours: 8,
    actualHours: 0,
    labels: ['Backend', 'Security'],
  }).save();

  await new taskModel({
    taskId: 'TSK-102',
    name: 'Design main dashboard layout',
    description: 'Build 12 stat cards & charts layout using Tailwind CSS.',
    priority: 'Medium',
    status: 'In Progress',
    projectId: proj1._id,
    assignee: dev2._id,
    reporter: pm._id,
    startDate: new Date('2026-07-03'),
    dueDate: new Date('2026-07-15'),
    estimatedHours: 12,
    actualHours: 6,
    labels: ['Frontend', 'UI'],
  }).save();

  await new taskModel({
    taskId: 'TSK-103',
    name: 'Review Stripe API Integration',
    description: 'Code review for backend payment controller.',
    priority: 'High',
    status: 'In Review',
    projectId: proj1._id,
    assignee: dev1._id,
    reporter: dev2._id,
    startDate: new Date('2026-07-06'),
    dueDate: new Date('2026-07-10'),
    estimatedHours: 4,
    actualHours: 4,
    labels: ['Backend', 'Review'],
  }).save();

  // 6. Create Bugs
  console.log('Seeding Bugs...');
  await new bugModel({
    bugId: 'BUG-001',
    title: 'Login redirect loop on expired sessions',
    description: 'Tokens that expire crash the page instead of redirecting.',
    projectId: proj1._id,
    module: 'Authentication',
    severity: 'Critical',
    priority: 'Urgent',
    assignedDev: dev1._id,
    reporter: qa._id,
    dueDate: new Date('2026-07-10'),
    status: 'Open',
  }).save();

  await new bugModel({
    bugId: 'BUG-002',
    title: 'Dashboard charts fail on Safari dark mode',
    description: 'CSS variables for grid lines return undefined.',
    projectId: proj1._id,
    module: 'Dashboard',
    severity: 'Medium',
    priority: 'Medium',
    assignedDev: dev2._id,
    reporter: qa._id,
    dueDate: new Date('2026-07-15'),
    status: 'In Progress',
  }).save();

  // 7. Create Test Suites & Cases
  console.log('Seeding QA Test Suites & Cases...');
  const suite = await new suiteModel({
    name: 'Authentication Regression',
    description: 'Covers login, signup, token expiry, & 2FA blocks',
    projectId: proj1._id,
    testCases: [],
    passRate: 100,
  }).save();

  const tc1 = await new tcModel({
    title: 'Successful Login with Valid Credentials',
    description: 'Verify login returns 200 and access token',
    suiteId: suite._id,
    projectId: proj1._id,
    steps: ['1. Fill email', '2. Fill password', '3. Submit form'],
    expectedResult: 'Access token generated & browser redirected to dashboard',
    status: 'Passed',
    isAutomated: true,
    assignee: qa._id,
  }).save();

  const tc2 = await new tcModel({
    title: 'Register fails with duplicate email address',
    description: 'Verify registration throws conflict exception',
    suiteId: suite._id,
    projectId: proj1._id,
    steps: ['1. Fill existing email', '2. Submit registration form'],
    expectedResult: '409 Conflict exception returned',
    status: 'Passed',
    isAutomated: true,
    assignee: qa._id,
  }).save();

  suite.testCases = [tc1._id, tc2._id] as any;
  await suite.save();

  // 8. Seeding Quality Metrics
  console.log('Seeding Quality Metrics...');
  await new qualityModel({
    projectId: proj1._id,
    qualityScore: 94,
    codeCoverage: 87,
    requirementCoverage: 95,
    testCoverage: 92,
    reviewScore: 4.6,
    bugDensity: 3.2,
    defectLeakage: 1.8,
    customerSatisfaction: 4.7,
    reopenedBugs: 2.1,
    failedBuilds: 3.5,
    qualityStatus: 'Excellent',
  }).save();

  console.log('Database Seeding Completed Successfully! 🌱');
  await app.close();
}

bootstrap();
