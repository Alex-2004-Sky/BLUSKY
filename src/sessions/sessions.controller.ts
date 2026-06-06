import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { StartSessionDto, EndSessionDto } from './session.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  // POST /api/sessions/start
  // Body: { consoleId, playerName? }
  @Post('start')
  start(@Body() dto: StartSessionDto) {
    return this.sessionsService.start(dto);
  }

  // POST /api/sessions/end
  // Body: { sessionId }
  // Returns session with cost = Math.round((durationMinutes × 200) / 7)
  @Post('end')
  end(@Body() dto: EndSessionDto) {
    return this.sessionsService.end(dto);
  }

  // GET /api/sessions/active
  // Returns all running sessions with live elapsed time and estimated cost
  @Get('active')
  findActive() {
    return this.sessionsService.findActive();
  }

  // GET /api/sessions
  // Full history of all completed sessions
  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  // GET /api/sessions/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(+id);
  }
}
