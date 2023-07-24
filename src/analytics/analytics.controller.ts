import { Body, Controller, Get, Post } from '@nestjs/common';
import { PubSubService } from '../pub-sub/pub-sub.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly pubSubService: PubSubService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post('event')
  async publishEvent(@Body() eventLog: CreateEventDto) {
    await this.pubSubService.publishMessage('analytics', eventLog);
  }

  @Get('daily')
  getDailyAnalytics() {
    return this.analyticsService.getDailyAnalytics();
  }
}
