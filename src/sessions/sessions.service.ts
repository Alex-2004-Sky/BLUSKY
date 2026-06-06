import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { ConsolesService } from '../consoles/consoles.service';
import { StartSessionDto, EndSessionDto } from './session.dto';

// ── BluSky Billing Constants ─────────────────────────────────
const PRICE_PER_BLOCK = 200; // MWK
const MINS_PER_BLOCK  = 7;   // minutes

// Formula: cost = Math.round((durationMinutes × 200) / 7)
function calcCost(durationMinutes: number): number {
  return Math.round((durationMinutes * PRICE_PER_BLOCK) / MINS_PER_BLOCK);
}
// ─────────────────────────────────────────────────────────────

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepo: Repository<Session>,
    private consolesService: ConsolesService,
  ) {}

  // POST /api/sessions/start
  async start(dto: StartSessionDto): Promise<Session> {
    const console = await this.consolesService.findOne(dto.consoleId);

    if (console.status === 'active') {
      throw new BadRequestException(
        `"${console.name}" already has an active session. End it first.`,
      );
    }

    const session = this.sessionsRepo.create({
      console,
      playerName: dto.playerName || 'Guest',
      startTime: new Date(),   // always set on backend — never trust frontend timer
      status: 'active',
    });

    const saved = await this.sessionsRepo.save(session);
    await this.consolesService.setStatus(dto.consoleId, 'active');
    return saved;
  }

  // POST /api/sessions/end
  async end(dto: EndSessionDto): Promise<Session> {
    const session = await this.sessionsRepo.findOne({
      where: { id: dto.sessionId },
      relations: ['console'],
    });

    if (!session) throw new NotFoundException(`Session ${dto.sessionId} not found`);
    if (session.status === 'completed') {
      throw new BadRequestException('This session has already been ended');
    }

    const endTime = new Date();

    // Step 1: duration in seconds
    const durationMs      = endTime.getTime() - new Date(session.startTime).getTime();
    const durationSeconds = durationMs / 1000;

    // Step 2: convert to minutes
    const durationMinutes = durationSeconds / 60;

    // Step 3: proportional cost  →  (minutes × 200) ÷ 7
    const cost = calcCost(durationMinutes);

    session.endTime         = endTime;
    session.durationSeconds = Math.round(durationSeconds * 100) / 100;
    session.durationMinutes = Math.round(durationMinutes * 10000) / 10000;
    session.cost            = cost;
    session.status          = 'completed';

    const completed = await this.sessionsRepo.save(session);
    await this.consolesService.setStatus(session.console.id, 'idle');
    return completed;
  }

  // GET /api/sessions/active
  async findActive(): Promise<any[]> {
    const active = await this.sessionsRepo.find({
      where: { status: 'active' },
      relations: ['console'],
    });

    const now = new Date();
    return active.map((s) => {
      const elapsedMs      = now.getTime() - new Date(s.startTime).getTime();
      const elapsedSec     = elapsedMs / 1000;
      const elapsedMinutes = elapsedSec / 60;
      const estimatedCost  = calcCost(elapsedMinutes);
      return {
        ...s,
        elapsedSeconds:  Math.floor(elapsedSec),
        elapsedMinutes:  Math.round(elapsedMinutes * 100) / 100,
        estimatedCost,
      };
    });
  }

  // GET /api/sessions
  findAll(): Promise<Session[]> {
    return this.sessionsRepo.find({
      relations: ['console'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET /api/sessions/:id
  async findOne(id: number): Promise<Session> {
    const s = await this.sessionsRepo.findOne({
      where: { id },
      relations: ['console'],
    });
    if (!s) throw new NotFoundException(`Session ${id} not found`);
    return s;
  }
}
