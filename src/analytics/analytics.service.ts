import { Injectable } from '@nestjs/common';
import { BigQueryService } from 'src/big-query/big-query.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly bigQueryService: BigQueryService) {}

  async getDailyAnalytics() {
    // return await this.bigQueryService.bigQuery.baseUrl;
  }
}
