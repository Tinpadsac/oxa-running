import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStatus, MediaType, SponsorTier } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateMediaDto {
  eventId?: string;
  type: MediaType;
  title: string;
  driveFileId?: string;
  youtubeId?: string;
  thumbnailDriveId?: string;
  sortOrder?: number;
}

export interface CreateSponsorDto {
  eventId?: string;
  name: string;
  tier?: SponsorTier;
  driveFileId?: string;
  logoUrl?: string;
  websiteUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCoverAndRouteDto {
  desktopCoverId?: string | null;
  mobileCoverId?: string | null;
  routeDriveId?: string | null;
  routeImageUrl?: string | null;
  distanceLabel?: string;
  realDistance?: string;
  location?: string;
  startTime?: string;
  dateText?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveGalleryEventId(eventId?: string): Promise<string> {
    if (eventId) {
      return eventId;
    }

    const archivedEvent = await this.prisma.event.findFirst({
      where: { status: EventStatus.LAST_ARCHIVED },
      select: { id: true },
    });

    if (archivedEvent) {
      return archivedEvent.id;
    }

    const activeEvent = await this.prisma.event.findFirst({
      where: { status: EventStatus.ACTIVE },
      select: { id: true },
    });

    if (!activeEvent) {
      throw new NotFoundException('No se encontró un evento para asociar el medio.');
    }

    return activeEvent.id;
  }

  private async resolveActiveEventId(): Promise<string> {
    const activeEvent = await this.prisma.event.findFirst({
      where: { status: EventStatus.ACTIVE },
      select: { id: true },
    });

    if (!activeEvent) {
      throw new NotFoundException('No hay una edición ACTIVE configurada.');
    }

    return activeEvent.id;
  }

  // --- FOTOS Y VIDEOS (MediaItem) ---
  async listMedia(eventId?: string) {
    const targetEventId = eventId ?? (await this.resolveGalleryEventId());
    return this.prisma.mediaItem.findMany({
      where: { eventId: targetEventId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createMedia(dto: CreateMediaDto) {
    const targetEventId = await this.resolveGalleryEventId(dto.eventId);

    return this.prisma.mediaItem.create({
      data: {
        eventId: targetEventId,
        type: dto.type,
        title: dto.title.trim(),
        driveFileId: dto.driveFileId?.trim() || null,
        youtubeId: dto.youtubeId?.trim() || null,
        thumbnailDriveId: dto.thumbnailDriveId?.trim() || null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async deleteMedia(id: string) {
    const existing = await this.prisma.mediaItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('El elemento multimedia no existe.');
    }

    await this.prisma.mediaItem.delete({ where: { id } });
    return { deleted: true, id };
  }

  // --- INSCRIPCIONES (Registration) ---
  async listRegistrations() {
    return this.prisma.registration.findMany({
      include: {
        event: {
          select: { edition: true, tagline: true },
        },
        pricingTier: {
          select: { name: true, priceSoles: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- AUSPICIADORES (Sponsor) ---
  async listSponsors() {
    return this.prisma.sponsor.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createSponsor(dto: CreateSponsorDto) {
    const activeEventId = dto.eventId ?? (await this.resolveActiveEventId().catch(() => null));

    return this.prisma.sponsor.create({
      data: {
        eventId: activeEventId,
        name: dto.name.trim(),
        tier: dto.tier ?? SponsorTier.PARTNER,
        driveFileId: dto.driveFileId?.trim() || null,
        logoUrl: dto.logoUrl?.trim() || null,
        websiteUrl: dto.websiteUrl?.trim() || null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async deleteSponsor(id: string) {
    const existing = await this.prisma.sponsor.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('El auspiciador no existe.');
    }

    await this.prisma.sponsor.delete({ where: { id } });
    return { deleted: true, id };
  }

  // --- PORTADA Y RUTA (Event ACTIVO) ---
  async getActiveEventConfig() {
    const eventId = await this.resolveActiveEventId();
    return this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        edition: true,
        tagline: true,
        dateText: true,
        startTime: true,
        location: true,
        distanceLabel: true,
        realDistance: true,
        desktopCoverId: true,
        mobileCoverId: true,
        routeDriveId: true,
        routeImageUrl: true,
      },
    });
  }

  async updateCoverAndRoute(dto: UpdateCoverAndRouteDto) {
    const eventId = await this.resolveActiveEventId();

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...(dto.desktopCoverId !== undefined
          ? { desktopCoverId: dto.desktopCoverId?.trim() || null }
          : {}),
        ...(dto.mobileCoverId !== undefined
          ? { mobileCoverId: dto.mobileCoverId?.trim() || null }
          : {}),
        ...(dto.routeDriveId !== undefined
          ? { routeDriveId: dto.routeDriveId?.trim() || null }
          : {}),
        ...(dto.routeImageUrl !== undefined
          ? { routeImageUrl: dto.routeImageUrl?.trim() || null }
          : {}),
        ...(dto.distanceLabel !== undefined
          ? { distanceLabel: dto.distanceLabel.trim() }
          : {}),
        ...(dto.realDistance !== undefined
          ? { realDistance: dto.realDistance.trim() }
          : {}),
        ...(dto.location !== undefined ? { location: dto.location.trim() } : {}),
        ...(dto.startTime !== undefined ? { startTime: dto.startTime.trim() } : {}),
        ...(dto.dateText !== undefined ? { dateText: dto.dateText.trim() } : {}),
      },
    });
  }
}