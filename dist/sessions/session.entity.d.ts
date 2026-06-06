import { Console } from '../consoles/console.entity';
export declare class Session {
    id: number;
    console: Console;
    playerName: string;
    startTime: Date;
    endTime: Date;
    durationSeconds: number;
    durationMinutes: number;
    cost: number;
    status: string;
    createdAt: Date;
}
