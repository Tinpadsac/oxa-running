export type MediaType = 'IMAGE' | 'VIDEO';
export type SponsorTier = 'MAIN' | 'GOLD' | 'SILVER' | 'PARTNER';

export interface AdminMediaItem {
  id: string;
  eventId: string;
  type: MediaType;
  title: string;
  driveFileId: string | null;
  youtubeId: string | null;
  thumbnailDriveId: string | null;
  sortOrder: number;
}

export interface AdminRegistrationItem {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shirtSize: string;
  amountPaid: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentRef: string | null;
  createdAt: string;
  event?: { edition: string; tagline: string };
  pricingTier?: { name: string; priceSoles: number };
}

export interface AdminSponsorItem {
  id: string;
  name: string;
  tier: SponsorTier;
  driveFileId: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminEventConfig {
  id: string;
  edition: string;
  tagline: string;
  dateText: string;
  startTime: string;
  location: string;
  distanceLabel: string;
  realDistance: string;
  desktopCoverId: string | null;
  mobileCoverId: string | null;
  routeDriveId: string | null;
  routeImageUrl: string | null;
}

function getApiBaseUrl(): string {
  const raw =
    (typeof process !== 'undefined' && process.env.API_URL) ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001/api';

  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

async function adminRequest<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/admin${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token.trim(),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Error ${response.status} en ${path}${errorBody ? `: ${errorBody}` : ''}`,
    );
  }

  return (await response.json()) as T;
}

export const adminApi = {
  listMedia: (token: string) =>
    adminRequest<AdminMediaItem[]>('/media', token),

  createMedia: (
    token: string,
    payload: {
      type: MediaType;
      title: string;
      driveFileId?: string;
      youtubeId?: string;
      thumbnailDriveId?: string;
      sortOrder?: number;
    },
  ) =>
    adminRequest<AdminMediaItem>('/media', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteMedia: (token: string, id: string) =>
    adminRequest<{ deleted: boolean; id: string }>(`/media/${id}`, token, {
      method: 'DELETE',
    }),

  listRegistrations: (token: string) =>
    adminRequest<AdminRegistrationItem[]>('/registrations', token),

  listSponsors: (token: string) =>
    adminRequest<AdminSponsorItem[]>('/sponsors', token),

  createSponsor: (
    token: string,
    payload: {
      name: string;
      tier: SponsorTier;
      driveFileId?: string;
      logoUrl?: string;
      websiteUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) =>
    adminRequest<AdminSponsorItem>('/sponsors', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteSponsor: (token: string, id: string) =>
    adminRequest<{ deleted: boolean; id: string }>(`/sponsors/${id}`, token, {
      method: 'DELETE',
    }),

  getEventConfig: (token: string) =>
    adminRequest<AdminEventConfig>('/event-config', token),

  updateEventConfig: (
    token: string,
    payload: Partial<Omit<AdminEventConfig, 'id' | 'edition'>>,
  ) =>
    adminRequest<AdminEventConfig>('/event-config', token, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};