import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface HeartbeatPayload {
  macAddress: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  cpuUsage: number;
  ramUsage?: string;
  localIp?: string;
}

@Injectable()
export class IotService {
  constructor(private prisma: PrismaService) {}

  async processHeartbeat(tenantId: string, payload: HeartbeatPayload) {
    // Upsert the edge node so if it's the first time connecting, it registers itself.
    // If it already exists, it just updates its vital telemetry.
    return this.prisma.edgeNode.upsert({
      where: { macAddress: payload.macAddress },
      update: {
        status: payload.status,
        cpuUsage: payload.cpuUsage,
        ramUsage: payload.ramUsage,
        localIp: payload.localIp,
        lastHeartbeat: new Date(),
        tenantId,
      },
      create: {
        macAddress: payload.macAddress,
        status: payload.status,
        cpuUsage: payload.cpuUsage,
        ramUsage: payload.ramUsage,
        localIp: payload.localIp,
        tenantId,
      },
    });
  }
}
