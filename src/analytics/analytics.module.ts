import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PubSubService } from 'src/pub-sub/pub-sub.service';
import { BigQueryService } from 'src/big-query/big-query.service';

@Module({
  imports: [],
  providers: [AnalyticsService, PubSubService, BigQueryService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
