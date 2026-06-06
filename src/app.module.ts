import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConsolesModule } from './consoles/consoles.module';
import { SessionsModule } from './sessions/sessions.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← reads .env globally
    DatabaseModule,
    AuthModule,
    ConsolesModule,
    SessionsModule,
    ReportsModule,
  ],
})
export class AppModule {}