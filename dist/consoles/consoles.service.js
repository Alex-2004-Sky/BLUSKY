"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const console_entity_1 = require("./console.entity");
let ConsolesService = class ConsolesService {
    constructor(consolesRepo) {
        this.consolesRepo = consolesRepo;
    }
    findAll() {
        return this.consolesRepo.find({ order: { id: 'ASC' } });
    }
    async findOne(id) {
        const c = await this.consolesRepo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException(`Console ${id} not found`);
        return c;
    }
    async create(dto) {
        const c = this.consolesRepo.create({ name: dto.name, status: 'idle' });
        return this.consolesRepo.save(c);
    }
    async remove(id) {
        const c = await this.findOne(id);
        if (c.status === 'active') {
            throw new common_1.BadRequestException('Cannot remove a console with an active session');
        }
        await this.consolesRepo.delete(id);
        return { message: 'Console removed' };
    }
    async setStatus(id, status) {
        await this.consolesRepo.update(id, { status });
    }
};
exports.ConsolesService = ConsolesService;
exports.ConsolesService = ConsolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(console_entity_1.Console)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsolesService);
//# sourceMappingURL=consoles.service.js.map