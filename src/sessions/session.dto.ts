import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class StartSessionDto {
  @IsNumber()
  @IsPositive()
  consoleId: number;

  @IsOptional()
  @IsString()
  playerName?: string;
}

export class EndSessionDto {
  @IsNumber()
  @IsPositive()
  sessionId: number;
}
