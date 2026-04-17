import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

// ─────────────────────────────────────────────────────────
// CurrentUser Decorator — Extracts the authenticated user from req.
// ─────────────────────────────────────────────────────────

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) return null;

    return data ? user[data] : user;
  },
);
