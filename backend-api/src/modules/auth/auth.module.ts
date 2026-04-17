import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService }    from './auth.service'

// ─────────────────────────────────────────────────────────
// AuthModule — Handles JWT authentication, OTP verification,
// and session management for all 9 user roles.
// ─────────────────────────────────────────────────────────

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get<string>('app.jwtSecret'),
        signOptions: { expiresIn: config.get<string>('app.jwtExpiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService],
  exports:     [AuthService, JwtModule],
})
export class AuthModule {}
