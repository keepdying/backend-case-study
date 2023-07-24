import { IsString, IsNumber, Equals } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Equals('event')
  type: string;

  @IsString()
  session_id: string;

  @IsString()
  event_name: string;

  @IsNumber()
  event_time: number;

  @IsString()
  page: string;

  @IsString()
  country: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsString()
  user_id: string;
}
