import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { FinanceService } from './finance.service';
import { CreateFeeRuleDto } from './dto/create-fee-rule.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ── Fee Rules ───────────────────────────────────────────

  @Post('rules')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER)
  @ApiOperation({ summary: 'Create a maintenance fee rule for a unit type' })
  createFeeRule(
    @Body() dto: CreateFeeRuleDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.financeService.createFeeRule(tenantId, dto);
  }

  @Get('rules')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER)
  @ApiOperation({ summary: 'List all fee rules for the society' })
  findAllFeeRules(@CurrentUser('tenantId') tenantId: string) {
    return this.financeService.findAllFeeRules(tenantId);
  }

  // ── Invoices ────────────────────────────────────────────

  @Post('invoices')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER)
  @ApiOperation({ summary: 'Generate a manual invoice for a unit' })
  createInvoice(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.financeService.createInvoice(tenantId, dto);
  }

  @Post('invoices/generate-batch')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER)
  @ApiOperation({ summary: 'Auto-generate monthly invoices for all units physically present in the PostgreSQL database' })
  generateMonthlyInvoices(@CurrentUser('tenantId') tenantId: string) {
    return this.financeService.generateMonthlyInvoices(tenantId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices with optional filter by unit' })
  @ApiQuery({ name: 'unitId', required: false, type: String })
  findAllInvoices(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
    @CurrentUser('unitId') currentUnitId: string,
    @Query('unitId') filterUnitId?: string,
  ) {
    // If the user is a normal resident, force the query to their own unit
    const isAdmin = ([UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER, UserRole.SECRETARY] as UserRole[]).includes(role as UserRole);
    const targetUnit = isAdmin ? filterUnitId : currentUnitId;

    return this.financeService.findAllInvoices(tenantId, targetUnit);
  }

  // ── Expenses ────────────────────────────────────────────

  @Post('expenses')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER)
  @ApiOperation({ summary: 'Record a new society expense' })
  createExpense(
    @Body() dto: CreateExpenseDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.financeService.createExpense(tenantId, dto);
  }

  @Get('expenses')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.TREASURER)
  @ApiOperation({ summary: 'List all recorded expenses' })
  findAllExpenses(@CurrentUser('tenantId') tenantId: string) {
    return this.financeService.findAllExpenses(tenantId);
  }
}
