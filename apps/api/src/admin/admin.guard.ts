import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedSecret = this.configService.get<string>('ADMIN_SECRET');
    if (!expectedSecret) {
      throw new ServiceUnavailableException(
        'La clave de administración (ADMIN_SECRET) no está configurada en el servidor.',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const headerToken = request.headers['x-admin-token'];
    const providedToken = Array.isArray(headerToken)
      ? headerToken[0]
      : headerToken;

    if (!providedToken || providedToken !== expectedSecret) {
      throw new UnauthorizedException('Token de administrador inválido o ausente.');
    }

    return true;
  }
}