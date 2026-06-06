import { IsString, MinLength, IsIn, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsString()
  username: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsOptional()
  @IsIn(['admin', 'staff'])
  role?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;
}