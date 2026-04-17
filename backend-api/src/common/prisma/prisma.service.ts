import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

// ─────────────────────────────────────────────────────────
// PrismaService — Injectable database client.
// Auto-connects on module init, disconnects on shutdown.
// Import PrismaModule in any feature module to use this.
// ─────────────────────────────────────────────────────────

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
