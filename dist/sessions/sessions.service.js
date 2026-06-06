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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./session.entity");
const consoles_service_1 = require("../consoles/consoles.service");
const PRICE_PER_BLOCK = 200;
const MINS_PER_BLOCK = 7;
function calcCost(durationMinutes) {
    return Math.round((durationMinutes * PRICE_PER_BLOCK) / MINS_PER_BLOCK);
}
let SessionsService = class SessionsService {
    constructor(sessionsRepo, consolesService) {
        this.sessionsRepo = sessionsRepo;
        this.consolesService = consolesService;
    }
    async start(dto) {
        const console = await this.consolesService.findOne(dto.consoleId);
        if (console.status === 'active') {
            throw new common_1.BadRequestException(`"${console.name}" already has an active session. End it first.`);
        }
        const session = this.sessionsRepo.create({
            console,
            playerName: dto.playerName || 'Guest',
            startTime: new Date(),
            status: 'active',
        });
        const saved = await this.sessionsRepo.save(session);
        await this.consolesService.setStatus(dto.consoleId, 'active');
        return saved;
    }
    async end(dto) {
        const session = await this.sessionsRepo.findOne({
            where: { id: dto.sessionId },
            relations: ['console'],
        });
        if (!session)
            throw new common_1.NotFoundException(`Session ${dto.sessionId} not found`);
        if (session.status === 'completed') {
            throw new common_1.BadRequestException('This session has already been ended');
        }
        const endTime = new Date();
        const durationMs = endTime.getTime() - new Date(session.startTime).getTime();
        const durationSeconds = durationMs / 1000;
        const durationMinutes = durationSeconds / 60;
        const cost = calcCost(durationMinutes);
        session.endTime = endTime;
        session.durationSeconds = Math.round(durationSeconds * 100) / 100;
        session.durationMinutes = Math.round(durationMinutes * 10000) / 10000;
        session.cost = cost;
        session.status = 'completed';
        const completed = await this.sessionsRepo.save(session);
        await this.consolesService.setStatus(session.console.id, 'idle');
        return completed;
    }
    async findActive() {
        const active = await this.sessionsRepo.find({
            where: { status: 'active' },
            relations: ['console'],
        });
        const now = new Date();
        return active.map((s) => {
            const elapsedMs = now.getTime() - new Date(s.startTime).getTime();
            const elapsedSec = elapsedMs / 1000;
            const elapsedMinutes = elapsedSec / 60;
            const estimatedCost = calcCost(elapsedMinutes);
            return {
                ...s,
                elapsedSeconds: Math.floor(elapsedSec),
                elapsedMinutes: Math.round(elapsedMinutes * 100) / 100,
                estimatedCost,
            };
        });
    }
    findAll() {
        return this.sessionsRepo.find({
            relations: ['console'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const s = await this.sessionsRepo.findOne({
            where: { id },
            relations: ['console'],
        });
        if (!s)
            throw new common_1.NotFoundException(`Session ${id} not found`);
        return s;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        consoles_service_1.ConsolesService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map