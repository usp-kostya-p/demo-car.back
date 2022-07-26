import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingQuery } from './dto/booking-query.dto';

@ApiTags('Бронирование автомобилей')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('cost')
  async calculateCost(@Query() query: BookingQuery) {
    return this.bookingService.calculateCost(
      query.start_date,
      query.end_date,
      query.car_id,
    );
  }

  @Get('avg_all_workload')
  async avgAllWorkload() {
    return this.bookingService.avgAllWorkload();
  }
}
