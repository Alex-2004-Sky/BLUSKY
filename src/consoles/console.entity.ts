import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity('CONSOLES')
export class Console {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME', length: 100 })
  name: string;

  @Column({ name: 'STATUS', default: 'idle', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @OneToMany(() => Session, (s) => s.console)
  sessions: Session[];
}