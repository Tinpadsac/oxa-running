import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStatus, MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicLandingData() {
    const [activeEvent, lastArchivedEvent] = await Promise.all([
      this.prisma.event.findFirst({
        where: { status: EventStatus.ACTIVE },
        include: {
          pricingTiers: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      this.prisma.event.findFirst({
        where: { status: EventStatus.LAST_ARCHIVED },
        include: {
          mediaItems: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
    ]);

    if (!activeEvent) {
      throw new NotFoundException('No hay una edición activa configurada.');
    }

    return {
      activeEvent: {
        ...activeEvent,
        desktopCoverUrl: activeEvent.desktopCoverId
          ? `https://lh3.googleusercontent.com/d/${activeEvent.desktopCoverId}=w1920`
          : '/images/portada1.png',
        mobileCoverUrl: activeEvent.mobileCoverId
          ? `https://lh3.googleusercontent.com/d/${activeEvent.mobileCoverId}=w1080`
          : '/images/portadamov1.png',
      },
      lastArchivedEvent: lastArchivedEvent
        ? {
            id: lastArchivedEvent.id,
            year: lastArchivedEvent.edition,
            title: lastArchivedEvent.tagline,
            description: lastArchivedEvent.description,
            stats: lastArchivedEvent.stats ?? [],
            media: lastArchivedEvent.mediaItems.map((item) => {
              if (item.type === MediaType.VIDEO) {
                return {
                  id: item.id,
                  type: item.type,
                  title: item.title,
                  thumbnailUrl: item.thumbnailDriveId
                    ? `https://lh3.googleusercontent.com/d/${item.thumbnailDriveId}=w800`
                    : `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`,
                  mediaUrl: `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`,
                };
              }

              return {
                id: item.id,
                type: item.type,
                title: item.title,
                thumbnailUrl: `https://lh3.googleusercontent.com/d/${item.driveFileId}=w800`,
                mediaUrl: `https://lh3.googleusercontent.com/d/${item.driveFileId}=w1600`,
              };
            }),
          }
        : null,
    };
  }
}