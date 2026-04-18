import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

// ─────────────────────────────────────────────────────────
// JwtStrategy — Validates incoming JWT tokens from request headers.
// ─────────────────────────────────────────────────────────

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecret') || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    // payload.sub is the user ID
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or disabled.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive.');
    }

    // The returned object gets attached to the request object as `req.user`
    return user;
  }
}
