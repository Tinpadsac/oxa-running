import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
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

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}