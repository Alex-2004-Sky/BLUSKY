import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ── CORS: allow the HTML dashboard to call this API ──
  app.enableCors({
    origin: '*',   // in production, replace * with your frontend URL
    methods: ['GET', 'POST', 'DELETE'],
  });

  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log('✅ BluSky Gaming API running → http://localhost:3000/api');
}
bootstrap();
