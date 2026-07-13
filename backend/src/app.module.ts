import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { BugsModule } from './bugs/bugs.module';
import { QualityModule } from './quality/quality.module';
import { SprintsModule } from './sprints/sprints.module';
import { TestCasesModule } from './testcases/testcases.module';
import { TeamsModule } from './teams/teams.module';
import { FilesModule } from './files/files.module';
import { LogsModule } from './logs/logs.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Connect to MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/qualitydesk', {
      serverSelectionTimeoutMS: 3000,
    }),
    
    // Core Business Modules
    AuthModule,
    ProjectsModule,
    TasksModule,
    BugsModule,
    QualityModule,
    SprintsModule,
    TestCasesModule,
    TeamsModule,
    FilesModule,
    LogsModule,
    ContactModule,
  ],
})
export class AppModule {}
