import { Injectable, ConflictException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFeeRuleDto } from './dto/create-fee-rule.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TIER 2 BUSINESS LOGIC
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ── 2.1 Maker-Checker for Expenses ─────────────────────
  // Treasurer creates expense (status=PENDING). President approves/rejects.
  async approveExpense(tenantId: string, expenseId: string, approverRole: string) {
    if (approverRole !== 'PRESIDENT' && approverRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only the President can approve expenses.');
    }

    const expense = await this.prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || expense.tenantId !== tenantId) throw new NotFoundException('Expense not found.');
    if (expense.status !== 'PENDING') throw new ConflictException('Expense is already processed.');

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'APPROVED' }
    });
  }

  async rejectExpense(tenantId: string, expenseId: string, approverRole: string) {
    if (approverRole !== 'PRESIDENT' && approverRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only the President can reject expenses.');
    }

    const expense = await this.prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || expense.tenantId !== tenantId) throw new NotFoundException('Expense not found.');

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { status: 'REJECTED' }
    });
  }

  // ── 2.2 Fee Waiver by President ────────────────────────
  // President can waive an invoice (sets status to WAIVED)
  async waiveInvoice(tenantId: string, invoiceId: string, approverRole: string) {
    if (approverRole !== 'PRESIDENT' && approverRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only the President can waive fees.');
    }

    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice || invoice.tenantId !== tenantId) throw new NotFoundException('Invoice not found.');

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'WAIVED' }
    });
  }

  // ── 2.3 Defaulter Service Block ────────────────────────
  // Returns units with dues overdue > thresholdDays (e.g. 90)
  async getDefaulters(tenantId: string, thresholdDays: number = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - thresholdDays);

    const overdueInvoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: { in: ['PENDING', 'OVERDUE'] },
        dueDate: { lt: cutoff }
      },
      include: {
        unit: {
          select: { id: true, flatNumber: true, building: { select: { name: true } }, residents: { select: { id: true, name: true } } }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return overdueInvoices;
  }

  // ── 2.4 Auto Late Fee CRON ─────────────────────────────
  // Runs daily at midnight. Marks overdue invoices and applies late fee.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async applyLateFees() {
    this.logger.log('[CRON] Running daily late fee calculation...');
    const now = new Date();

    // Find all PENDING invoices past due date
    const overdueInvoices = await this.prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lt: now }
      },
      include: {
        unit: { select: { type: true, tenantId: true } }
      }
    });

    let updatedCount = 0;
    for (const inv of overdueInvoices) {
      // Get the fee rule for this unit type to find lateFeePercent
      const rule = await this.prisma.feeRule.findFirst({
        where: { tenantId: inv.tenantId, unitType: inv.unit.type }
      });

      const lateFee = rule ? (inv.amount * rule.lateFeePercent / 100) : 0;

      await this.prisma.invoice.update({
        where: { id: inv.id },
        data: {
          status: 'OVERDUE',
          amount: inv.amount + lateFee // Apply late fee to the total
        }
      });
      updatedCount++;
    }

    this.logger.log(`[CRON] Marked ${updatedCount} invoices as OVERDUE with late fees applied.`);
  }

  // ── 2.5 Auto Payment Reminders ─────────────────────────
  // Runs daily. Logs reminders for invoices due in 7, 3, or 1 day(s).
  // In production, this would trigger WhatsApp/Push/SMS via NotificationsService.
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendPaymentReminders() {
    this.logger.log('[CRON] Checking for upcoming payment due dates...');
    const now = new Date();

    for (const daysBefore of [7, 3, 1]) {
      const target = new Date();
      target.setDate(now.getDate() + daysBefore);
      const startOfDay = new Date(target); startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(target); endOfDay.setHours(23, 59, 59, 999);

      const invoices = await this.prisma.invoice.findMany({
        where: {
          status: 'PENDING',
          dueDate: { gte: startOfDay, lte: endOfDay }
        },
        include: {
          unit: { select: { flatNumber: true, residents: { select: { name: true, phone: true } } } }
        }
      });

      for (const inv of invoices) {
        // TODO: Wire to NotificationsService.sendSMS/sendPush when 3rd party keys are provided
        this.logger.log(`[REMINDER] ${daysBefore}d before due: Flat ${inv.unit.flatNumber} owes ₹${inv.amount} (due ${inv.dueDate.toLocaleDateString()})`);
      }
    }
  }

  // ── 2.6 Financial Reports (P&L, Budget vs Actual) ──────
  async getFinancialSummary(tenantId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();

    // Total Income (paid invoices)
    const paidInvoices = await this.prisma.invoice.aggregate({
      where: { tenantId, status: 'PAID', year: targetYear },
      _sum: { amount: true },
      _count: true
    });

    // Total Pending
    const pendingInvoices = await this.prisma.invoice.aggregate({
      where: { tenantId, status: { in: ['PENDING', 'OVERDUE'] }, year: targetYear },
      _sum: { amount: true },
      _count: true
    });

    // Total Expenses (approved)
    const approvedExpenses = await this.prisma.expense.aggregate({
      where: { tenantId, status: 'APPROVED' },
      _sum: { amount: true },
      _count: true
    });

    // All Expenses
    const totalExpenses = await this.prisma.expense.aggregate({
      where: { tenantId },
      _sum: { amount: true },
      _count: true
    });

    // Expense by category
    const expenseByCategory = await this.prisma.expense.groupBy({
      by: ['category'],
      where: { tenantId, status: 'APPROVED' },
      _sum: { amount: true }
    });

    // Monthly collection trend
    const monthlyCollections = await this.prisma.invoice.groupBy({
      by: ['month'],
      where: { tenantId, status: 'PAID', year: targetYear },
      _sum: { amount: true },
      _count: true
    });

    // Monthly expense trend (approved expenses, grouped by month)
    const allApprovedExpenses = await this.prisma.expense.findMany({
      where: {
        tenantId,
        status: 'APPROVED',
        createdAt: {
          gte: new Date(`${targetYear}-01-01`),
          lt: new Date(`${targetYear + 1}-01-01`),
        },
      },
      select: { amount: true, createdAt: true },
    });

    // Group expenses by month name
    const expenseByMonth = new Map<string, { spent: number; count: number }>();
    for (const exp of allApprovedExpenses) {
      const monthName = exp.createdAt.toLocaleString('default', { month: 'long' });
      const entry = expenseByMonth.get(monthName) || { spent: 0, count: 0 };
      entry.spent += exp.amount;
      entry.count += 1;
      expenseByMonth.set(monthName, entry);
    }

    const monthlyExpenseTrend = Array.from(expenseByMonth.entries()).map(([month, data]) => ({
      month,
      spent: data.spent,
      count: data.count,
    }));

    const totalIncome = paidInvoices._sum.amount || 0;
    const totalSpent = approvedExpenses._sum.amount || 0;

    return {
      year: targetYear,
      income: {
        collected: totalIncome,
        pending: pendingInvoices._sum.amount || 0,
        paidCount: paidInvoices._count,
        pendingCount: pendingInvoices._count
      },
      expenses: {
        approved: totalSpent,
        total: totalExpenses._sum.amount || 0,
        count: totalExpenses._count,
        byCategory: expenseByCategory.map(e => ({ category: e.category, amount: e._sum.amount || 0 }))
      },
      profitLoss: totalIncome - totalSpent,
      collectionRate: paidInvoices._count > 0 ? Math.round((paidInvoices._count / (paidInvoices._count + pendingInvoices._count)) * 100) : 0,
      monthlyTrend: monthlyCollections.map(m => ({ month: m.month, collected: m._sum.amount || 0, count: m._count })),
      monthlyExpenseTrend,
    };
  }
}
