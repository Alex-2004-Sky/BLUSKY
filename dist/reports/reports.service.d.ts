import { Repository } from 'typeorm';
import { Session } from '../sessions/session.entity';
export declare class ReportsService {
    private sessionsRepo;
    constructor(sessionsRepo: Repository<Session>);
    daily(): Promise<{
        date: string;
        revenue: number;
        totalSessions: number;
        totalMinutes: number;
        byConsole: Record<string, number>;
        recentSessions: {
            id: number;
            consoleName: string;
            playerName: string;
            durationMinutes: number;
            cost: number;
        }[];
    }>;
}
