import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();
let isAppInitialized = false;
let nestApp: any;

async function bootstrap() {
  if (!isAppInitialized) {
    nestApp = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    // Enable CORS for frontend requests
    nestApp.enableCors({
      origin: '*',
      credentials: true,
    });
    
    // Global prefix for API endpoints
    nestApp.setGlobalPrefix('api');
    
    // Validation pipes
    nestApp.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));

    await nestApp.init();
    isAppInitialized = true;
  }
}

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
