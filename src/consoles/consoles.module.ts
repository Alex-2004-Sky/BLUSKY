import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Console } from './console.entity';
import { ConsolesService } from './consoles.service';
import { ConsolesController } from './consoles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Console])],
  providers: [ConsolesService],
  controllers: [ConsolesController],
  exports: [ConsolesService],
})
export class ConsolesModule {}
