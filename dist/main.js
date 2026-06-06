"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE'],
    });
    app.setGlobalPrefix('api');
    await app.listen(3000);
    console.log('✅ BluSky Gaming API running → http://localhost:3000/api');
}
bootstrap();
//# sourceMappingURL=main.js.map