/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './middleware/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform DTOs
      whitelist: true, // Strip unwanted properties
      forbidNonWhitelisted: true, // Reject requests with unknown properties
    }),
  );

  // Add global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const options = new DocumentBuilder()
    .setTitle('Djengo API')
    .setDescription('All APIs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const PORT = Number(process.env.PORT) || 8080;
  const HOST = process.env.HOST || '0.0.0.0';

  await app.listen(PORT, HOST);
  console.log(`Application is running on http://${HOST}:${PORT}`);
}
bootstrap();
