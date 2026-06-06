import { Repository } from 'typeorm';
import { Console } from './console.entity';
import { CreateConsoleDto } from './console.dto';
export declare class ConsolesService {
    private consolesRepo;
    constructor(consolesRepo: Repository<Console>);
    findAll(): Promise<Console[]>;
    findOne(id: number): Promise<Console>;
    create(dto: CreateConsoleDto): Promise<Console>;
    remove(id: number): Promise<{
        message: string;
    }>;
    setStatus(id: number, status: 'idle' | 'active'): Promise<void>;
}
