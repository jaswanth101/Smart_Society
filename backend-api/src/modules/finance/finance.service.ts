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

  async generateMonthlyInvoices(tenantId: string) {
    const rules = await this.prisma.feeRule.findMany({ where: { tenantId } });
    if (!rules.length) throw new NotFoundException('No fee rules configured. Configure fee rules first.');

    const units = await this.prisma.unit.findMany({ where: { tenantId } });
    
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    let createdCount = 0;

    for (const unit of units) {
      // Find exact rule for UnitType, or fallback to the very first rule if someone misconfigured it.
      const rule = rules.find(r => r.unitType === unit.type) || rules[0];
      
      const exists = await this.prisma.invoice.findFirst({
        where: { unitId: unit.id, month, year }
      });

      if (!exists) {
        const dueDate = new Date();
        dueDate.setDate(rule.dueDay);
        // If due date has already passed this month, push to next month
        if (dueDate < now) {
          dueDate.setMonth(dueDate.getMonth() + 1);
        }

        await this.prisma.invoice.create({
          data: {
            tenantId,
            unitId: unit.id,
            amount: rule.baseAmount,
            dueDate,
            month,
            year,
            status: 'PENDING'
          }
        });
        createdCount++;
      }
    }
    
    return { message: `Generated ${createdCount} invoices for ${month} ${year}.`, count: createdCount, month, year };
  }

  async payInvoice(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id }
    });
    if (!invoice || invoice.tenantId !== tenantId) {
      throw new NotFoundException('Invoice not found in this society.');
    }
    
    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      }
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
