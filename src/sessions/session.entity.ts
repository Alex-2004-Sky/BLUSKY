import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Console } from '../consoles/console.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Console, { eager: true })
  @JoinColumn({ name: 'console_id' })
  console: Console;

  @Column({ name: 'player_name', length: 100, default: 'Guest' })
  playerName: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @Column({ name: 'duration_seconds', type: 'decimal', precision: 10, scale: 2, nullable: true })
  durationSeconds: number;

  @Column({ name: 'duration_minutes', type: 'decimal', precision: 10, scale: 4, nullable: true })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ default: 'active', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}