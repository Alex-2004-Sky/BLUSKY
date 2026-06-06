import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Console } from '../consoles/console.entity';

@Entity('SESSIONS')
export class Session {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ManyToOne(() => Console, { eager: true })
  @JoinColumn({ name: 'CONSOLE_ID' })
  console: Console;

  @Column({ name: 'PLAYER_NAME', length: 100, default: 'Guest' })
  playerName: string;

  @Column({ name: 'START_TIME' })
  startTime: Date;

  @Column({ name: 'END_TIME', nullable: true })
  endTime: Date;

  @Column({ name: 'DURATION_SECONDS', type: 'decimal', precision: 10, scale: 2, nullable: true })
  durationSeconds: number;

  @Column({ name: 'DURATION_MINUTES', type: 'decimal', precision: 10, scale: 4, nullable: true })
  durationMinutes: number;

  @Column({ name: 'COST', type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ name: 'STATUS', default: 'active', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}