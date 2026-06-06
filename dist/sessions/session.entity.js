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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const typeorm_1 = require("typeorm");
const console_entity_1 = require("../consoles/console.entity");
let Session = class Session {
};
exports.Session = Session;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Session.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => console_entity_1.Console, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'console_id' }),
    __metadata("design:type", console_entity_1.Console)
], Session.prototype, "console", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'player_name', length: 100, default: 'Guest' }),
    __metadata("design:type", String)
], Session.prototype, "playerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time' }),
    __metadata("design:type", Date)
], Session.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', nullable: true }),
    __metadata("design:type", Date)
], Session.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_seconds', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_minutes', type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active', length: 20 }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Session.prototype, "createdAt", void 0);
exports.Session = Session = __decorate([
    (0, typeorm_1.Entity)('sessions')
], Session);
//# sourceMappingURL=session.entity.js.map