import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { BigQueryModule } from './big-query/big-query.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PubSubModule, BigQueryModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
