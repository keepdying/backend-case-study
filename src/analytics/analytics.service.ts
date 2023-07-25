import { BigQueryDate } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { BigQueryService } from 'src/big-query/big-query.service';

const table_name =
  process.env.NODE_ENV === 'production'
    ? process.env.BIGQUERY_TABLE_NAME
    : 'analytics.events';

@Injectable()
export class AnalyticsService {
  constructor(private readonly bigQueryService: BigQueryService) {}

  async getDailyAnalytics() {
    const total_user_count_query = `
    SELECT
      COUNT(DISTINCT user_id) AS total_users
    FROM
      \`${table_name}\`;
      `;

    const daily_query = `
    -- Create a CTE with the user_id and first_date columns 
    WITH first_date_cte AS (
      SELECT user_id, MIN(DATE(TIMESTAMP_SECONDS(event_time))) AS first_date 
      FROM \`${table_name}\` 
      GROUP BY user_id 
    ),
    
    -- Calculate the duration for each session by finding the difference between the maximum and minimum event_time
    session_duration AS (
      SELECT session_id, MAX(event_time) - MIN(event_time) AS duration
      FROM \`${table_name}\`
      GROUP BY session_id
    )
    
    -- Join the CTE with the distinct user_id and date pairs from the original table 
    -- and select the date, count the distinct user_id as active_users, 
    -- and count the user_id that have the same date as first_date as new_users
    -- Also join the session_duration CTE and calculate the average duration for each day by dividing the sum of durations by the count of sessions
    SELECT 
      events.date, 
      COUNT(DISTINCT events.user_id) AS active_users, 
      COUNTIF(first_date_cte.first_date = events.date) AS new_users,
      SUM(session_duration.duration) / COUNT(session_duration.session_id) AS avg_duration
    FROM (
      SELECT DISTINCT 
        DATE(TIMESTAMP_SECONDS(event_time)) AS date, 
        user_id,
        session_id
      FROM 
      \`${table_name}\`
    ) events
    JOIN first_date_cte
    ON events.user_id = first_date_cte.user_id
    JOIN session_duration USING (session_id)
    GROUP BY 
      events.date
    ORDER BY 
      events.date DESC;
    `;
    const [total_users] = await this.bigQueryService.bigQuery.query(
      total_user_count_query,
    );

    const [daily_durations_and_users] =
      await this.bigQueryService.bigQuery.query(daily_query);

    for (const row of daily_durations_and_users) {
      row.date = new BigQueryDate(row.date.value).value;
    }

    return {
      total_users: total_users[0].total_users,
      daily_stats: daily_durations_and_users,
    };
  }
}
