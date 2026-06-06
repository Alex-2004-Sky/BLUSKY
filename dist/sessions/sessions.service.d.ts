import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { ConsolesService } from '../consoles/consoles.service';
import { StartSessionDto, EndSessionDto } from './session.dto';
export declare class SessionsService {
    private sessionsRepo;
    private consolesService;
    constructor(sessionsRepo: Repository<Session>, consolesService: ConsolesService);
    start(dto: StartSessionDto): Promise<Session>;
    end(dto: EndSessionDto): Promise<Session>;
    findActive(): Promise<any[]>;
    findAll(): Promise<Session[]>;
    findOne(id: number): Promise<Session>;
}
