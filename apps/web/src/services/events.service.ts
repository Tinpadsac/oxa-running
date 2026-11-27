import {
  EVENT_DATA,
  LAST_EDITION_DATA,
  LastEdition,
  MediaItem,
  PricingTier,
} from '@/data/eventData';

export type EventViewModel = typeof EVENT_DATA & {
  desktopCoverUrl: string;
  mobileCoverUrl: string;
  routeImageUrl: string;
};

export interface PublicSponsorViewModel {
  id: string;
  name: string;
  tier: 'MAIN' | 'GOLD' | 'SILVER' | 'PARTNER';
  logoUrl: string | null;
  websiteUrl: string | null;
}

interface PricingTierDto {
  id: string;
  name: string;
  subtitle: string;
  priceSoles: number;
  status: 'ACTIVE' | 'UPCOMING' | 'SOLD_OUT';
  totalSlots?: number | null;
  availableSlots?: number | null;
  benefits: string[] | null;
}

interface ActiveEventDto {
  id: string;
  edition: string;
  tagline: string;
  slogan: string;
  dateText: string;
  startTime: string;
  location: string;
  distanceLabel: string;
  realDistance: string;
  whatsappNumber: string;
  socialHandle: string;
  desktopCoverUrl?: string | null;
  mobileCoverUrl?: string | null;
  routeImageResolvedUrl?: string | null;
  routeImageUrl?: string | null;
  pricingTiers?: PricingTierDto[];
}

interface LastArchivedEventDto {
  id: string;
  year: string;
  title: string;
  description: string | null;
  stats: { label: string; value: string }[] | null;
  media?: MediaItem[];
}

interface SponsorDto {
  id: string;
  name: string;
  tier: 'MAIN' | 'GOLD' | 'SILVER' | 'PARTNER';
  logoUrl: string | null;
  websiteUrl: string | null;
}

interface PublicEventsResponseDto {
  activeEvent: ActiveEventDto | null;
  lastArchivedEvent: LastArchivedEventDto | null;
  sponsors?: SponsorDto[];
}

export interface PublicEventsViewModel {
  eventData: EventViewModel;
  lastEditionData: LastEdition;
  sponsors: PublicSponsorViewModel[];
}

function resolvePublicEventsEndpoint(): string {
  const rawBase = (process.env.API_URL || 'http://localhost:3001/api')
    .trim()
    .replace(/\/+$/, '');
  const apiBase = rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`;
  return `${apiBase}/events/public`;
}

function formatWhatsappDisplay(whatsappNumber: string): string {
  const digits = whatsappNumber.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('51')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
  }
  return digits ? `+${digits}` : EVENT_DATA.whatsappDisplay;
}

function mapPricingTier(dto: PricingTierDto): PricingTier {
  return {
    id: dto.id,
    name: dto.name,
    subtitle: dto.subtitle,
    priceSoles: Number(dto.priceSoles),
    status: dto.status,
    ...(dto.status === 'ACTIVE' && typeof dto.availableSlots === 'number'
      ? { slotsAvailable: dto.availableSlots }
      : {}),
    benefits: Array.isArray(dto.benefits) ? dto.benefits : [],
  };
}

export async function getPublicEventsViewModel(): Promise<PublicEventsViewModel> {
  const endpoint = resolvePublicEventsEndpoint();

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} desde ${endpoint}`);
    }

    const payload = (await response.json()) as PublicEventsResponseDto;

    const eventData: EventViewModel = payload.activeEvent
      ? {
          brand: EVENT_DATA.brand,
          edition: payload.activeEvent.edition,
          tagline: payload.activeEvent.tagline,
          slogan: payload.activeEvent.slogan,
          dateText: payload.activeEvent.dateText,
          startTime: payload.activeEvent.startTime,
          location: payload.activeEvent.location,
          distanceLabel: payload.activeEvent.distanceLabel,
          realDistance: payload.activeEvent.realDistance,
          whatsappNumber: payload.activeEvent.whatsappNumber,
          whatsappDisplay: formatWhatsappDisplay(payload.activeEvent.whatsappNumber),
          socialHandle: payload.activeEvent.socialHandle,
          desktopCoverUrl: payload.activeEvent.desktopCoverUrl || '/images/portada1.png',
          mobileCoverUrl: payload.activeEvent.mobileCoverUrl || '/images/portadamov1.png',
          routeImageUrl:
            payload.activeEvent.routeImageResolvedUrl ||
            payload.activeEvent.routeImageUrl ||
            '/images/ruta-12k.jpg',
          pricingTiers: (payload.activeEvent.pricingTiers ?? []).map(mapPricingTier),
        }
      : {
          ...EVENT_DATA,
          desktopCoverUrl: '/images/portada1.png',
          mobileCoverUrl: '/images/portadamov1.png',
          routeImageUrl: '/images/ruta-12k.jpg',
        };

    const lastEditionData: LastEdition = payload.lastArchivedEvent
      ? {
          year: payload.lastArchivedEvent.year,
          title: payload.lastArchivedEvent.title,
          description: payload.lastArchivedEvent.description ?? '',
          stats: Array.isArray(payload.lastArchivedEvent.stats)
            ? payload.lastArchivedEvent.stats
            : [],
          media: Array.isArray(payload.lastArchivedEvent.media)
            ? payload.lastArchivedEvent.media
            : [],
        }
      : LAST_EDITION_DATA;

    const sponsors: PublicSponsorViewModel[] = Array.isArray(payload.sponsors)
      ? payload.sponsors
      : [];

    return { eventData, lastEditionData, sponsors };
  } catch (error) {
    console.warn(
      '[EventsService] Fallback estático activado:',
      error instanceof Error ? error.message : error,
    );
    return {
      eventData: {
        ...EVENT_DATA,
        desktopCoverUrl: '/images/portada1.png',
        mobileCoverUrl: '/images/portadamov1.png',
        routeImageUrl: '/images/ruta-12k.jpg',
      },
      lastEditionData: LAST_EDITION_DATA,
      sponsors: [],
    };
  }
}