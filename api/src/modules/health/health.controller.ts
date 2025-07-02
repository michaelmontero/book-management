import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('/health')
@ApiTags('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get('')
  @HealthCheck()
  @ApiOperation({
    summary: 'Determine endpoint health status',
  })
  available() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
