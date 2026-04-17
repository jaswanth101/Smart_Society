import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginDto }   from './dto/login.dto'

// ─────────────────────────────────────────────────────────
// AuthService — Business logic for authentication.
// Handles both admin (email+password) and resident (phone+OTP) flows.
// TODO: inject UserRepository and connect to real DB once Phase 1 begins.
// ─────────────────────────────────────────────────────────

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    // TODO: query user from PostgreSQL, validate password with bcrypt
    throw new UnauthorizedException('Authentication not yet implemented')
  }

  async sendOtp(phone: string) {
    // TODO: generate 6-digit OTP, store in Redis with TTL 300s, send via MSG91
    return { message: `OTP sent to ${phone}` }
  }

  async verifyOtp(phone: string, otp: string) {
    // TODO: validate OTP from Redis, fetch user, sign JWT
    throw new UnauthorizedException('OTP verification not yet implemented')
  }

  async refreshToken(refreshToken: string) {
    // TODO: verify refresh token, issue new access token
    throw new UnauthorizedException('Token refresh not yet implemented')
  }
}
