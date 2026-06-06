import { SessionsService } from './sessions.service';
import { StartSessionDto, EndSessionDto } from './session.dto';
export declare class SessionsController {
    private sessionsService;
    constructor(sessionsService: SessionsService);
    start(dto: StartSessionDto): Promise<import("./session.entity").Session>;
    end(dto: EndSessionDto): Promise<import("./session.entity").Session>;
    findActive(): Promise<any[]>;
    findAll(): Promise<import("./session.entity").Session[]>;
    findOne(id: string): Promise<import("./session.entity").Session>;
}
