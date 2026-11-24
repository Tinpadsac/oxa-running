export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  priceSoles: number;
  status: 'SOLD_OUT' | 'ACTIVE' | 'UPCOMING';
  slotsAvailable?: number;
  benefits: string[];
}

export const EVENT_DATA = {
  brand: 'OXA RUNNING',
  edition: '2026',
  slogan: 'CORRE • RESPIRA • CONECTA',
  tagline: 'Reto de la Reserva de Biosfera',
  dateText: '11 de Octubre',
  startTime: '6:30 AM',
  location: 'Plaza Principal de Oxapampa',
  distanceLabel: 'RUTA 12K',
  realDistance: '12.6 KM',
  whatsappNumber: '51959837371',
  whatsappDisplay: '959 837 371',
  socialHandle: '@oxarunning2026',
  pricingTiers: [
    {
      id: 'early-bird',
      name: 'Preventa Early Bird',
      subtitle: 'Cupos limitados por lanzamiento',
      priceSoles: 75,
      status: 'ACTIVE',
      slotsAvailable: 42,
      benefits: [
        'Polo oficial Dry-Fit Oxa Running',
        'Dorsal con chip de cronometraje',
        'Medalla Finisher de colección',
        'Hidratación y fruta en ruta y meta',
      ],
    },
    {
      id: 'preventa-2',
      name: 'Preventa Regular',
      subtitle: 'Disponible hasta agotar stock',
      priceSoles: 95,
      status: 'UPCOMING',
      benefits: [
        'Polo oficial Dry-Fit Oxa Running',
        'Dorsal con chip de cronometraje',
        'Medalla Finisher de colección',
        'Hidratación y fruta en ruta y meta',
      ],
    },
    {
      id: 'general',
      name: 'Tarifa General',
      subtitle: 'Últimos cupos antes del evento',
      priceSoles: 115,
      status: 'UPCOMING',
      benefits: [
        'Polo oficial Dry-Fit Oxa Running',
        'Dorsal con chip de cronometraje',
        'Medalla Finisher de colección',
        'Hidratación y fruta en ruta y meta',
      ],
    },
  ] as PricingTier[],
};