import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'USERNAME', length: 80, unique: true })
  username: string;

  @Column({ name: 'PASSWORD_HASH', length: 255 })
  passwordHash: string;

  @Column({ name: 'ROLE', default: 'staff', length: 20 })
  role: string;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}