import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from './configuration';
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/assets', express.static(join(__dirname, '..', 'assets')));

  // Prefix API
  app.setGlobalPrefix('api');

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API docs for my NestJS project')
    .setVersion('1.0')
    // .addBearerAuth()   // nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService<AppConfigType>);
  const port = configService.get("PORT") ?? 3000;

  await app.listen(port, () => { console.log(`Server is running on http://localhost:${port}/api/docs`) });


}
bootstrap();
