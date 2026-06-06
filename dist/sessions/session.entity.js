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
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID' }),
    __metadata("design:type", Number)
], Session.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => console_entity_1.Console, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'CONSOLE_ID' }),
    __metadata("design:type", console_entity_1.Console)
], Session.prototype, "console", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PLAYER_NAME', length: 100, default: 'Guest' }),
    __metadata("design:type", String)
], Session.prototype, "playerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'START_TIME' }),
    __metadata("design:type", Date)
], Session.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'END_TIME', nullable: true }),
    __metadata("design:type", Date)
], Session.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DURATION_SECONDS', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DURATION_MINUTES', type: 'decimal', precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'COST', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Session.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'STATUS', default: 'active', length: 20 }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'CREATED_AT' }),
    __metadata("design:type", Date)
], Session.prototype, "createdAt", void 0);
exports.Session = Session = __decorate([
    (0, typeorm_1.Entity)('SESSIONS')
], Session);
//# sourceMappingURL=session.entity.js.map