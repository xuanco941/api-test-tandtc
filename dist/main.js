"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'src', 'assets'), {
        prefix: '/assets/',
    });
    app.set('trust proxy', 1);
    app.enableCors({
        origin: '*',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('My API')
        .setDescription('API docs for my NestJS project')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customCssUrl: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui.css',
        ],
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.29.0/swagger-ui-standalone-preset.js',
        ],
    });
    const configService = app.get((config_1.ConfigService));
    const port = configService.get("PORT") ?? 3000;
    await app.listen(port, () => { console.log(`Server is running on http://localhost:${port}/api/docs`); });
}
bootstrap();
//# sourceMappingURL=main.js.map