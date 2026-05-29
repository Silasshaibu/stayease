import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './src/app.module';
import type { Express } from 'express';

let server: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (server) return server;

  const expressApp = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    rawBody: true,
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn'],
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  await app.init();
  server = expressApp;
  return server;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  app(req, res);
}
