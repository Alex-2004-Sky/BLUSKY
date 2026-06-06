import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
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
