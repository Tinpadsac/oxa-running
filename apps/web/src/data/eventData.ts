export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  priceSoles: number;
  status: 'ACTIVE' | 'UPCOMING' | 'SOLD_OUT';
  slotsAvailable?: number;
  benefits: string[];
}

export interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  title: string;
  thumbnailUrl: string;
  mediaUrl: string; // Para VIDEO: URL de YouTube embed (ej. https://www.youtube.com/embed/ID?autoplay=1)
}

export interface LastEdition {
  year: string;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  media: MediaItem[];
}

export const EVENT_DATA = {
  brand: 'OXA RUNNING',
  edition: '2027',
  tagline: 'EL RETO HISTÓRICO • MEDIA MARATÓN 21K',
  slogan: 'CORRE • RESPIRA • CONECTA',
  dateText: 'Octubre 2027',
  startTime: '6:30 AM',
  location: 'Plaza Principal de Oxapampa',
  distanceLabel: 'Circuito 21K',
  realDistance: '21.097 KM',
  whatsappNumber: '51999999999', // Reemplazar por el número real del organizador
  whatsappDisplay: '+51 999 999 999',
  socialHandle: '@oxarunning',
  pricingTiers: [
    {
      id: 'preventa-1',
      name: 'Preventa 1',
      subtitle: 'Tarifa lanzamiento por tiempo limitado',
      priceSoles: 75,
      status: 'ACTIVE',
      slotsAvailable: 45,
      benefits: [
        'Polo oficial edición 2027',
        'Dorsal con chip de cronometraje',
        'Medalla Finisher de colección',
        'Hidratación y fruta en ruta y meta',
        'Asistencia médica y guardarropa',
      ],
    },
    {
      id: 'preventa-2',
      name: 'Preventa 2',
      subtitle: 'Segunda fase promocional',
      priceSoles: 90,
      status: 'UPCOMING',
      benefits: [
        'Polo oficial edición 2027',
        'Dorsal con chip de cronometraje',
        'Medalla Finisher de colección',
        'Hidratación y fruta en ruta y meta',
        'Asistencia médica y guardarropa',
      ],
    },
    {
      id: 'regular',
      name: 'Tarifa Regular',
      subtitle: 'Últimos cupos antes del evento',
      priceSoles: 110,
      status: 'UPCOMING',
      benefits: [
        'Polo oficial edición 2027',
        'Dorsal con chip de cronometraje',
        'Medalla Finisher de colección',
        'Hidratación y fruta en ruta y meta',
        'Asistencia médica y guardarropa',
      ],
    },
  ] as PricingTier[],
};

export const LAST_EDITION_DATA: LastEdition = {
  year: '2026',
  title: 'Así se vivió Oxa Running 2026',
  description:
    'En octubre de 2026, más de 500 corredores conquistaron las rutas de Oxapampa entre neblina, montaña y pura energía. Revive los mejores momentos.',
  stats: [
    { label: 'Corredores', value: '+500' },
    { label: 'Delegaciones', value: '12' },
    { label: 'Km Recorridos', value: '12.5K' },
    { label: 'Satisfacción', value: '99%' },
  ],
  media: [
    {
      id: 'vid-1',
      type: 'VIDEO',
      title: 'Aftermovie Oficial Oxa Running 2026',
      thumbnailUrl: '/images/portada1.png',
      mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
    },
    {
      id: 'img-1',
      type: 'IMAGE',
      title: 'Partida en la Plaza Principal',
      thumbnailUrl: '/images/portada1.png',
      mediaUrl: '/images/portada1.png',
    },
    {
      id: 'img-2',
      type: 'IMAGE',
      title: 'Paso por la ruta Chontabamba',
      thumbnailUrl: '/images/ruta-12k.jpg',
      mediaUrl: '/images/ruta-12k.jpg',
    },
    {
      id: 'img-3',
      type: 'IMAGE',
      title: 'Llegada y premiación general',
      thumbnailUrl: '/images/portadamov1.png',
      mediaUrl: '/images/portadamov1.png',
    },
  ],
};