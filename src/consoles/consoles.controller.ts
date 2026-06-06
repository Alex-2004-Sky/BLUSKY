import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ConsolesService } from './consoles.service';
import { CreateConsoleDto } from './console.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('consoles')
export class ConsolesController {
  constructor(private consolesService: ConsolesService) {}

  // GET /api/consoles
  // Returns all consoles with idle/active status
  @Get()
  findAll() {
    return this.consolesService.findAll();
  }

  // GET /api/consoles/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consolesService.findOne(+id);
  }

  // POST /api/consoles
  // Body: { name }
  @Post()
  create(@Body() dto: CreateConsoleDto) {
    return this.consolesService.create(dto);
  }

  // DELETE /api/consoles/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consolesService.remove(+id);
  }
}
