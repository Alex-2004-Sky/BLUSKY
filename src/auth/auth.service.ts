import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { LoginDto, ChangePasswordDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('Invalid username or password');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid username or password');
    const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
    return {
      access_token: token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  async register(dto: RegisterDto, requestingUser: { role: string }) {
    if (requestingUser.role !== 'admin') throw new ForbiddenException('Only admins can create staff profiles');
    const existing = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ username: dto.username, passwordHash, role: dto.role || 'staff' });
    const saved = await this.usersRepo.save(user);
    return { id: saved.id, username: saved.username, role: saved.role };
  }

  async findAllUsers(requestingUser: { role: string }) {
    if (requestingUser.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.usersRepo.find({ select: ['id', 'username', 'role'], order: { id: 'DESC' } });
  }

  async deleteUser(userId: number, requestingUser: { userId: number; role: string }) {
    if (requestingUser.role !== 'admin') throw new ForbiddenException('Admins only');
    if (requestingUser.userId === userId) throw new ForbiddenException('Cannot delete your own account');
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    await this.usersRepo.remove(user);
    return { message: `${user.username} deleted` };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepo.save(user);
    return { message: 'Password updated successfully' };
  }
}