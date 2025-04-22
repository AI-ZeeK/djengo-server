"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('/api/v1');
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5000',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Djengo API')
        .setDescription('All APIs')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    const PORT = Number(process.env.PORT) || 8080;
    await app.listen(PORT);
    console.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map