import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { LoginDto, ChangePasswordDto, RegisterDto } from './auth.dto';
export declare class AuthService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    register(dto: RegisterDto, requestingUser: {
        role: string;
    }): Promise<{
        id: number;
        username: string;
        role: string;
    }>;
    findAllUsers(requestingUser: {
        role: string;
    }): Promise<User[]>;
    deleteUser(userId: number, requestingUser: {
        userId: number;
        role: string;
    }): Promise<{
        message: string;
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
