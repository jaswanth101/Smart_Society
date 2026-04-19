import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { ElectionStatus } from '@prisma/client';

@Injectable()
export class ElectionsService {
  constructor(private prisma: PrismaService) {}

  // 1. Get Live active election with Quorum calculations
  async getActiveElection(tenantId: string) {
    const election = await this.prisma.election.findFirst({
      where: { 
        tenantId,
        status: { in: [ElectionStatus.UPCOMING, ElectionStatus.VOTING_OPEN] }
      },
      include: {
        candidates: {
          orderBy: { voteCount: 'desc' },
        },
        _count: {
          select: { votes: true }
        }
      },
    });

    if (!election) return null;

    // Get Total Units in Society for calculating Quorum Live Percentage
    const totalFlats = await this.prisma.unit.count({
      where: { tenantId }
    });

    const voteCount = election._count.votes;
    const quorumPercentage = totalFlats > 0 ? Math.round((voteCount / totalFlats) * 100) : 0;
    const isQuorumMet = quorumPercentage >= election.quorum;

    return {
      ...election,
      liveStats: {
        totalFlats,
        votesCast: voteCount,
        quorumPercentage,
        isQuorumMet
      }
    };
  }

  // 2. Start a new Election
  async createElection(tenantId: string, dto: CreateElectionDto) {
    // Only one active election allowed at a time
    const active = await this.prisma.election.findFirst({
      where: { tenantId, status: { in: [ElectionStatus.UPCOMING, ElectionStatus.VOTING_OPEN] } }
    });

    if (active) throw new BadRequestException('An active election is already running.');

    return this.prisma.election.create({
      data: {
        ...dto,
        tenantId,
        status: ElectionStatus.VOTING_OPEN,
        startDate: new Date(),
      }
    });
  }

  // 3. Initiate Handover (Seal the Election)
  async resolveElection(tenantId: string, id: string) {
    const election = await this.prisma.election.findFirst({
      where: { id, tenantId }
    });

    if (!election) throw new NotFoundException('Election not found');

    return this.prisma.election.update({
      where: { id },
      data: { 
        status: ElectionStatus.COMPLETED,
        endDate: new Date()
      }
    });
  }
}
