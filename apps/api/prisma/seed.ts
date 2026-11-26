import 'dotenv/config';
import { PrismaClient, EventStatus, PricingStatus, MediaType } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl = new URL(process.env.DATABASE_URL!);
const useSsl = dbUrl.searchParams.has('ssl') || dbUrl.searchParams.has('sslaccept');


const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  connectTimeout: 15000,
  acquireTimeout: 15000,
  connectionLimit: 5,
  ...(useSsl && {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  }),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Evento Activo (2027)
  await prisma.event.upsert({
    where: { edition: '2027' },
    update: {},
    create: {
      edition: '2027',
      status: EventStatus.ACTIVE,
      tagline: 'Reto de la Reserva de Biosfera',
      slogan: 'CORRE • RESPIRA • CONECTA',
      dateText: 'Octubre 2027',
      startTime: '6:30 AM',
      location: 'Plaza Principal de Oxapampa',
      distanceLabel: 'Ruta Oficial 12K',
      realDistance: '12.5K',
      whatsappNumber: '51999999999',
      socialHandle: '@oxarunning',
      pricingTiers: {
        create: [
          {
            name: 'Preventa 1',
            subtitle: 'Tarifa lanzamiento por tiempo limitado',
            priceSoles: 75,
            status: PricingStatus.ACTIVE,
            totalSlots: 100,
            availableSlots: 45,
            sortOrder: 1,
            benefits: [
              'Polo oficial edición 2027',
              'Dorsal con chip de cronometraje',
              'Medalla Finisher de colección',
              'Hidratación y fruta en ruta y meta',
              'Asistencia médica y guardarropa',
            ],
          },
          {
            name: 'Preventa 2',
            subtitle: 'Segunda fase promocional',
            priceSoles: 90,
            status: PricingStatus.UPCOMING,
            totalSlots: 150,
            availableSlots: 150,
            sortOrder: 2,
            benefits: [
              'Polo oficial edición 2027',
              'Dorsal con chip de cronometraje',
              'Medalla Finisher de colección',
              'Hidratación y fruta en ruta y meta',
              'Asistencia médica y guardarropa',
            ],
          },
          {
            name: 'Tarifa Regular',
            subtitle: 'Últimos cupos antes del evento',
            priceSoles: 110,
            status: PricingStatus.UPCOMING,
            totalSlots: 200,
            availableSlots: 200,
            sortOrder: 3,
            benefits: [
              'Polo oficial edición 2027',
              'Dorsal con chip de cronometraje',
              'Medalla Finisher de colección',
              'Hidratación y fruta en ruta y meta',
              'Asistencia médica y guardarropa',
            ],
          },
        ],
      },
    },
  });

  // 2. Última Edición Archivada (2026)
  await prisma.event.upsert({
    where: { edition: '2026' },
    update: {},
    create: {
      edition: '2026',
      status: EventStatus.LAST_ARCHIVED,
      tagline: 'Así se vivió Oxa Running 2026',
      slogan: 'CORRE • RESPIRA • CONECTA',
      dateText: 'Octubre 2026',
      startTime: '6:30 AM',
      location: 'Plaza Principal de Oxapampa',
      distanceLabel: 'Ruta Oficial 12K',
      realDistance: '12.5K',
      whatsappNumber: '51999999999',
      socialHandle: '@oxarunning',
      description:
        'En octubre de 2026, más de 500 corredores conquistaron las rutas de Oxapampa entre neblina, montaña y pura energía. Revive los mejores momentos.',
      stats: [
        { label: 'Corredores', value: '+500' },
        { label: 'Delegaciones', value: '12' },
        { label: 'Km Recorridos', value: '12.5K' },
        { label: 'Satisfacción', value: '99%' },
      ],
      mediaItems: {
        create: [
          {
            type: MediaType.VIDEO,
            title: 'Aftermovie Oficial Oxa Running 2026',
            youtubeId: 'dQw4w9WgXcQ',
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log('Seed completado: Ediciones 2027 (ACTIVE) y 2026 (LAST_ARCHIVED) listas.');
}

main()
  .catch((e) => {
    console.dir(e, { depth: null });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });