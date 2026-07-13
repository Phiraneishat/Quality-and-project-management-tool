// ── User & Auth Types ──
export type UserRole = 'Admin' | 'Project Manager' | 'Team Lead' | 'Developer' | 'QA Tester' | 'Client';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  isVerified: boolean;
  is2FAEnabled: boolean;
  isFaceIdRegistered?: boolean;
  faceLoginCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// ── Project Types ──
export type ProjectStatus = 'Planning' | 'Design' | 'Development' | 'Testing' | 'Review' | 'Deployment' | 'Completed' | 'Archived';
export type ProjectPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  riskLevel: RiskLevel;
  budget: number;
  startDate: string;
  endDate: string;
  progress: number;
  teamMembers: string[];
  tags: string[];
  milestones: Milestone[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

// ── Task Types ──
export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Testing' | 'Blocked' | 'Completed';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Task {
  _id: string;
  taskId: string;
  name: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string;
  sprintId?: string;
  assignee?: User;
  reporter?: User;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  labels: string[];
  attachments: FileAttachment[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// ── Sprint Types ──
export type SprintStatus = 'Planning' | 'Active' | 'Review' | 'Completed';

export interface Sprint {
  _id: string;
  name: string;
  projectId: string;
  goal: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  tasks: string[];
  velocity: number;
  createdAt: string;
  updatedAt: string;
}

// ── Bug Types ──
export type BugStatus = 'Open' | 'Assigned' | 'In Progress' | 'Ready for QA' | 'Testing' | 'Closed' | 'Reopened';
export type BugSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Bug {
  _id: string;
  bugId: string;
  title: string;
  description: string;
  screenshots: string[];
  projectId: string;
  sprintId?: string;
  module: string;
  severity: BugSeverity;
  priority: TaskPriority;
  assignedDev?: User;
  reporter?: User;
  dueDate: string;
  status: BugStatus;
  comments: Comment[];
  attachments: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

// ── Quality Types ──
export type QualityStatus = 'Excellent' | 'Good' | 'Average' | 'Poor';

export interface QualityMetric {
  _id: string;
  projectId: string;
  sprintId?: string;
  qualityScore: number;
  codeCoverage: number;
  requirementCoverage: number;
  testCoverage: number;
  reviewScore: number;
  bugDensity: number;
  defectLeakage: number;
  customerSatisfaction: number;
  reopenedBugs: number;
  failedBuilds: number;
  qualityStatus: QualityStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Test Case Types ──
export type TestCaseStatus = 'Passed' | 'Failed' | 'Blocked' | 'Not Executed';

export interface TestCase {
  _id: string;
  title: string;
  description: string;
  suiteId: string;
  projectId: string;
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  status: TestCaseStatus;
  isAutomated: boolean;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TestSuite {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  testCases: string[];
  passRate: number;
  createdAt: string;
}

// ── Team Types ──
export interface Employee {
  _id: string;
  userId: string;
  user: User;
  department: string;
  teamId?: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'On Leave' | 'Unavailable';
  performance: number;
  joinDate: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  leadId: string;
  members: string[];
  department: string;
  createdAt: string;
}

export interface Department {
  _id: string;
  name: string;
  headId: string;
  teams: string[];
}

// ── File Types ──
export interface FileAttachment {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

// ── Comment Types ──
export interface Comment {
  _id: string;
  content: string;
  author: User;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Notification Types ──
export type NotificationType = 'task_assigned' | 'bug_assigned' | 'sprint_started' | 'deadline_reminder' | 'mention' | 'comment' | 'status_change';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ── Calendar Types ──
export type CalendarEventType = 'meeting' | 'deadline' | 'sprint' | 'holiday' | 'release' | 'milestone';

export interface CalendarEvent {
  _id: string;
  title: string;
  description: string;
  type: CalendarEventType;
  startDate: string;
  endDate: string;
  allDay: boolean;
  color: string;
}

// ── Chat Types ──
export interface Chat {
  _id: string;
  name: string;
  type: 'team' | 'project' | 'group' | 'direct';
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  sender?: User;
  content: string;
  attachments: FileAttachment[];
  mentions: string[];
  createdAt: string;
}

// ── Report Types ──
export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type ReportType = 'project' | 'sprint' | 'task' | 'employee' | 'productivity' | 'quality' | 'bug';

export interface Report {
  _id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  generatedBy: string;
  fileUrl: string;
  createdAt: string;
}

// ── Activity Log ──
export type ActivityAction = 'created' | 'updated' | 'deleted' | 'assigned' | 'commented' | 'uploaded' | 'status_changed';

export interface ActivityLog {
  _id: string;
  userId: string;
  user?: User;
  action: ActivityAction;
  entity: string;
  entityId: string;
  entityName: string;
  details?: string;
  createdAt: string;
}

// ── Dashboard Stats ──
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  delayedProjects: number;
  pendingTasks: number;
  completedTasks: number;
  openBugs: number;
  closedBugs: number;
  activeSprints: number;
  teamMembers: number;
  qualityScore: number;
  productivityScore: number;
}

// ── Toast ──
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
