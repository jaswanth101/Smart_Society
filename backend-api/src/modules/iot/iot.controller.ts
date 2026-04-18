import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IotService } from './iot.service';
import type { HeartbeatPayload } from './iot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('IoT Edge Telemetry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post('heartbeat')
  @ApiOperation({ summary: 'Webhook for Edge Server to report system health and status' })
  recordHeartbeat(
    @Body() payload: HeartbeatPayload,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.iotService.processHeartbeat(tenantId, payload);
  }
}
