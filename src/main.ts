/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform DTOs
      whitelist: true, // Strip unwanted properties
      forbidNonWhitelisted: true, // Reject requests with unknown properties
    }),
  );
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: 'http://localhost:5000', // Replace with your frontend URL
    credentials: true,
  });

  // app.useGlobalFilters(new HttpExceptionFilter())

  const options = new DocumentBuilder()
    .setTitle('Djengo API')
    .setDescription('All APIs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const PORT = Number(process.env.PORT) || 8080;
  // app.enableCors({
  // origin: 'http://localhost:3000', // Allow requests from this origin
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  // credentials: true,
  // });

  await app.listen(PORT);
  console.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
