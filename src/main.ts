import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfigType } from './configuration';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'src', 'assets'), {
    prefix: '/assets/',   // URL prefix (quan trọng)
  });
  app.set('trust proxy', 1);
  app.enableCors({
    origin: '*',
  }); // Enables CORS for all origins by default


  // Prefix API
  // app.setGlobalPrefix('api');

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API docs for my NestJS project')
    .setVersion('1.0')
    // .addBearerAuth()   // nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui.css',
    ],
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui-standalone-preset.js',
    ],
  });

  const configService = app.get(ConfigService<AppConfigType>);
  const port = configService.get("PORT") ?? 3000;

  await app.listen(port, () => { console.log(`Server is running on http://localhost:${port}/api/docs`) });


}
bootstrap();
