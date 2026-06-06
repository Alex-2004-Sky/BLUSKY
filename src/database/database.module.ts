import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../auth/user.entity';
import { Console } from '../consoles/console.entity';
import { Session } from '../sessions/session.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
  type: 'oracle',
  host: config.get('DB_HOST'),
  port: +config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  serviceName: config.get('DB_SERVICE_NAME'),  // ← must be serviceName
  synchronize: false,
  logging: ['error'],
  entities: [User, Console, Session],
}),
    }),
  ],
})
export class DatabaseModule {}