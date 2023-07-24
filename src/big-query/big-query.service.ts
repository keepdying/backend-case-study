import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigQueryService {
  public readonly bigQuery: BigQuery;

  constructor() {
    this.bigQuery = new BigQuery();
  }
}
