import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Console } from './console.entity';
import { CreateConsoleDto } from './console.dto';

@Injectable()
export class ConsolesService {
  constructor(
    @InjectRepository(Console)
    private consolesRepo: Repository<Console>,
  ) {}

  // GET /api/consoles
  findAll(): Promise<Console[]> {
    return this.consolesRepo.find({ order: { id: 'ASC' } });
  }

  // GET /api/consoles/:id
  async findOne(id: number): Promise<Console> {
    const c = await this.consolesRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Console ${id} not found`);
    return c;
  }

  // POST /api/consoles
  async create(dto: CreateConsoleDto): Promise<Console> {
    const c = this.consolesRepo.create({ name: dto.name, status: 'idle' });
    return this.consolesRepo.save(c);
  }

  // DELETE /api/consoles/:id
  async remove(id: number): Promise<{ message: string }> {
    const c = await this.findOne(id);
    if (c.status === 'active') {
      throw new BadRequestException('Cannot remove a console with an active session');
    }
    await this.consolesRepo.delete(id);
    return { message: 'Console removed' };
  }

  // Called internally by SessionsService
  async setStatus(id: number, status: 'idle' | 'active'): Promise<void> {
    await this.consolesRepo.update(id, { status });
  }
}
