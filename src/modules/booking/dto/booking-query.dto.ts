import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumberString } from 'class-validator';

export class BookingQuery {
  @ApiProperty()
  @IsNumberString()
  public readonly car_id: number;

  @ApiProperty()
  @IsDateString()
  public readonly start_date: Date;

  @ApiProperty()
  @IsDateString()
  public readonly end_date: Date;
}
