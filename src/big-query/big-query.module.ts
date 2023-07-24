import { Module } from '@nestjs/common';
import { BigQueryService } from './big-query.service';

@Module({
  providers: [BigQueryService],
})
export class BigQueryModule {}
