import { Session } from '../sessions/session.entity';
export declare class Console {
    id: number;
    name: string;
    status: string;
    createdAt: Date;
    sessions: Session[];
}
