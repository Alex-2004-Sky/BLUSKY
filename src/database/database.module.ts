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
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        synchronize: true,
        logging: ['error'],
        entities: [User, Console, Session],
      }),
    }),
  ],
})
export class DatabaseModule {}