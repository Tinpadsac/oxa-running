import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStatus, MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

function extractDriveId(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match =
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  return match ? match[1] : trimmed;
}

function buildDriveImageUrl(
  rawId: string | null | undefined,
  width: number,
): string | null {
  const cleanId = extractDriveId(rawId);
  if (!cleanId) return null;
  return `https://drive.google.com/thumbnail?id=${cleanId}&sz=w${width}`;
}

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
        desktopCoverUrl:
          buildDriveImageUrl(activeEvent.desktopCoverId, 1920) ??
          '/images/portada1.png',
        mobileCoverUrl:
          buildDriveImageUrl(activeEvent.mobileCoverId, 1080) ??
          '/images/portadamov1.png',
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
                  thumbnailUrl:
                    buildDriveImageUrl(item.thumbnailDriveId, 800) ??
                    `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`,
                  mediaUrl: `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`,
                };
              }

              const thumb = buildDriveImageUrl(item.driveFileId, 800) ?? '';
              const full = buildDriveImageUrl(item.driveFileId, 1600) ?? '';

              return {
                id: item.id,
                type: item.type,
                title: item.title,
                thumbnailUrl: thumb,
                mediaUrl: full,
              };
            }),
          }
        : null,
    };
  }
}