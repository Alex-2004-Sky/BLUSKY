import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto, RegisterDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            role: string;
        };
    }>;
    register(dto: RegisterDto, req: any): Promise<{
        id: number;
        username: string;
        role: string;
    }>;
    findAllUsers(req: any): Promise<import("./user.entity").User[]>;
    deleteUser(id: string, req: any): Promise<{
        message: string;
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
