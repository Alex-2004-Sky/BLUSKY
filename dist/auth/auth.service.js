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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./user.entity");
let AuthService = class AuthService {
    constructor(usersRepo, jwtService) {
        this.usersRepo = usersRepo;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.usersRepo.findOne({ where: { username: dto.username } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid username or password');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid username or password');
        const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
        return {
            access_token: token,
            user: { id: user.id, username: user.username, role: user.role },
        };
    }
    async register(dto, requestingUser) {
        if (requestingUser.role !== 'admin')
            throw new common_1.ForbiddenException('Only admins can create staff profiles');
        const existing = await this.usersRepo.findOne({ where: { username: dto.username } });
        if (existing)
            throw new common_1.ConflictException('Username already exists');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.usersRepo.create({ username: dto.username, passwordHash, role: dto.role || 'staff' });
        const saved = await this.usersRepo.save(user);
        return { id: saved.id, username: saved.username, role: saved.role };
    }
    async findAllUsers(requestingUser) {
        if (requestingUser.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        return this.usersRepo.find({ select: ['id', 'username', 'role'], order: { id: 'DESC' } });
    }
    async deleteUser(userId, requestingUser) {
        if (requestingUser.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        if (requestingUser.userId === userId)
            throw new common_1.ForbiddenException('Cannot delete your own account');
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        await this.usersRepo.remove(user);
        return { message: `${user.username} deleted` };
    }
    async changePassword(userId, dto) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException();
        user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.usersRepo.save(user);
        return { message: 'Password updated successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map