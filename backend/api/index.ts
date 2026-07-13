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
    const rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qualitydesk';
    const maskedUri = rawUri.replace(/:([^:@]+)@/, ':******@');
    console.log(`[Vercel Serverless] Initializing NestJS App. Target Database URI: ${maskedUri}`);

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

    console.log('[Vercel Serverless] Bootstrapping database connection and modules via nestApp.init()...');
    await nestApp.init();
    console.log('[Vercel Serverless] NestJS Application initialized successfully! 🚀');
    isAppInitialized = true;
  }
}

export default async (req: any, res: any) => {
  try {
    await bootstrap();
    server(req, res);
  } catch (err: any) {
    console.error("Vercel Serverless Bootstrap Error:", err);
    res.status(500).json({
      error: "Vercel Serverless Bootstrap Error",
      message: err.message,
      stack: err.stack,
    });
  }
};
