import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFeeRuleDto } from './dto/create-fee-rule.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  // ── Fee Rules ───────────────────────────────────────────

  async createFeeRule(tenantId: string, dto: CreateFeeRuleDto) {
    const existing = await this.prisma.feeRule.findFirst({
      where: { tenantId, unitType: dto.unitType },
    });

    if (existing) {
      throw new ConflictException(`Fee rule for ${dto.unitType} already exists.`);
    }

    return this.prisma.feeRule.create({
      data: { ...dto, tenantId },
    });
  }

  async findAllFeeRules(tenantId: string) {
    return this.prisma.feeRule.findMany({ where: { tenantId } });
  }

  // ── Invoices ────────────────────────────────────────────

  async createInvoice(tenantId: string, dto: CreateInvoiceDto) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.unitId }
    });

    if (!unit || unit.tenantId !== tenantId) {
      throw new NotFoundException('Unit not found in this society.');
    }

    return this.prisma.invoice.create({
      data: { ...dto, tenantId },
    });
  }

  async findAllInvoices(tenantId: string, unitId?: string) {
    const filter: any = { tenantId };
    if (unitId) filter.unitId = unitId;

    return this.prisma.invoice.findMany({
      where: filter,
      include: {
        unit: {
          select: { flatNumber: true, building: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ── Expenses ────────────────────────────────────────────

  async createExpense(tenantId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: { ...dto, tenantId },
    });
  }

  async findAllExpenses(tenantId: string) {
    return this.prisma.expense.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
