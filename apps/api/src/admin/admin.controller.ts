import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AdminService,
  type CreateMediaDto,
  type CreateSponsorDto,
  type UpdateCoverAndRouteDto,
} from './admin.service';
import { AdminGuard } from './admin.guard';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- FOTOS Y VIDEOS ---
  @Get('media')
  listMedia(@Query('eventId') eventId?: string) {
    return this.adminService.listMedia(eventId);
  }

  @Post('media')
  createMedia(@Body() dto: CreateMediaDto) {
    return this.adminService.createMedia(dto);
  }

  @Delete('media/:id')
  deleteMedia(@Param('id') id: string) {
    return this.adminService.deleteMedia(id);
  }

  // --- INSCRIPCIONES ---
  @Get('registrations')
  listRegistrations() {
    return this.adminService.listRegistrations();
  }

  // --- AUSPICIADORES ---
  @Get('sponsors')
  listSponsors() {
    return this.adminService.listSponsors();
  }

  @Post('sponsors')
  createSponsor(@Body() dto: CreateSponsorDto) {
    return this.adminService.createSponsor(dto);
  }

  @Delete('sponsors/:id')
  deleteSponsor(@Param('id') id: string) {
    return this.adminService.deleteSponsor(id);
  }

  // --- PORTADA Y RUTA ---
  @Get('event-config')
  getActiveEventConfig() {
    return this.adminService.getActiveEventConfig();
  }

  @Patch('event-config')
  updateCoverAndRoute(@Body() dto: UpdateCoverAndRouteDto) {
    return this.adminService.updateCoverAndRoute(dto);
  }
}