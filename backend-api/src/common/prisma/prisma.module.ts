import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

// ─────────────────────────────────────────────────────────
// PrismaModule — Global module. Import once in AppModule,
// then PrismaService is available everywhere via DI.
// ─────────────────────────────────────────────────────────

@Global()
@Module({
  providers: [PrismaService],
  exports:   [PrismaService],
})
export class PrismaModule {}
