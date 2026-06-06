import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Session } from '../sessions/session.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepo: Repository<Session>,
  ) {}

  // GET /api/reports/daily
  async daily() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sessions = await this.sessionsRepo.find({
      where: { status: 'completed', createdAt: MoreThanOrEqual(startOfDay) },
      relations: ['console'],
    });

    const revenue       = sessions.reduce((a, s) => a + Number(s.cost), 0);
    const totalSessions = sessions.length;
    const totalMinutes  = sessions.reduce((a, s) => a + Number(s.durationMinutes), 0);

    // Revenue per console
    const byConsole: Record<string, number> = {};
    sessions.forEach((s) => {
      const name = s.console?.name || 'Unknown';
      byConsole[name] = (byConsole[name] || 0) + Number(s.cost);
    });

    return {
      date: new Date().toLocaleDateString('en-GB'),
      revenue: Math.round(revenue),
      totalSessions,
      totalMinutes: Math.round(totalMinutes * 100) / 100,
      byConsole,
      recentSessions: sessions.slice(0, 7).map((s) => ({
        id: s.id,
        consoleName: s.console?.name,
        playerName: s.playerName,
        durationMinutes: s.durationMinutes,
        cost: s.cost,
      })),
    };
  }
}
