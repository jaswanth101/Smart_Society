import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ─────────────────────────────────────────────────────────
// JwtAuthGuard — Apply to routes to require a valid Bearer token.
// ─────────────────────────────────────────────────────────

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
