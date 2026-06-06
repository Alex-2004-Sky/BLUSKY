import { ConsolesService } from './consoles.service';
import { CreateConsoleDto } from './console.dto';
export declare class ConsolesController {
    private consolesService;
    constructor(consolesService: ConsolesService);
    findAll(): Promise<import("./console.entity").Console[]>;
    findOne(id: string): Promise<import("./console.entity").Console>;
    create(dto: CreateConsoleDto): Promise<import("./console.entity").Console>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
