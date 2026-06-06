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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("../sessions/session.entity");
let ReportsService = class ReportsService {
    constructor(sessionsRepo) {
        this.sessionsRepo = sessionsRepo;
    }
    async daily() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const sessions = await this.sessionsRepo.find({
            where: { status: 'completed', createdAt: (0, typeorm_2.MoreThanOrEqual)(startOfDay) },
            relations: ['console'],
        });
        const revenue = sessions.reduce((a, s) => a + Number(s.cost), 0);
        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((a, s) => a + Number(s.durationMinutes), 0);
        const byConsole = {};
        sessions.forEach((s) => {
            const name = s.console?.name || 'Unknown';
            byConsole[name] = (byConsole[name] || 0) + Number(s.cost);
        });
        return {
            date: new Date().toLocaleDateString('en-GB'),
            revenue: Math.round(revenue),
            totalSessions,
            totalMinutes: Math.round(totalMinutes * 100) / 100,
            byConsole,
            recentSessions: sessions.slice(0, 7).map((s) => ({
                id: s.id,
                consoleName: s.console?.name,
                playerName: s.playerName,
                durationMinutes: s.durationMinutes,
                cost: s.cost,
            })),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map