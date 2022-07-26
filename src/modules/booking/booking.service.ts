import { HttpException, Injectable } from '@nestjs/common';
import { differenceInCalendarDays } from 'date-fns';
import { DatabaseService } from '../database/database.service';
import { BookingEntity } from './booking.types';

@Injectable()
export class BookingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async avgAllWorkload() {
    const carIds = await this.databaseService.executeQuery<{ car_id: number }>(
      `SELECT car_id FROM booking_car GROUP BY car_id`,
    );

    const booking = await this.databaseService.executeQuery<BookingEntity>(
      `SELECT * FROM booking_car WHERE (NOW() - INTERVAL '30 DAY') < END_DATE`,
    );

    const awgWorkloadByCar: {
      id: number;
      percentWorkloadInMounth: number;
    }[] = carIds.reduce((prev, current) => {
      const result: { id?: number; percentWorkloadInMounth?: number } = {};
      const carWorkload = booking.filter((el) => el.car_id === current.car_id);
      const number = carWorkload.reduce((p, c) => {
        const days = differenceInCalendarDays(c.end_date, c.start_date);

        const percentWorkload = (days * 100) / 30;

        return (p += percentWorkload);
      }, 0);

      result.id = current.car_id;
      result.percentWorkloadInMounth = Number(number.toFixed(2));

      prev.push(result);
      return prev;
    }, []);

    const awgAllWorkload = awgWorkloadByCar.reduce((prev, current) => {
      return (prev += current.percentWorkloadInMounth);
    }, 0);
    return {
      awgWorkloadByCar,
      awgAllWorkload: Number(
        (awgAllWorkload / awgWorkloadByCar.length).toFixed(2),
      ),
    };
  }

  async availableCars(car_id: number) {
    const date = new Date();

    date.setDate(date.getDate() - 3);

    return this.databaseService.executeQuery<BookingEntity>(
      `SELECT "car_id", "end_date" FROM (SELECT "car_id", "end_date" FROM "booking_car" WHERE "car_id" = $1 ORDER BY "end_date" DESC limit $2) AS "latest_date" WHERE "end_date"::date < $3`,
      [car_id, 1, new Date(date.valueOf()).toISOString()],
    );
  }

  async calculateCost(start: Date, end: Date, car_id: number) {
    const isAvailable = await this.availableCars(car_id);

    if (!isAvailable.length) throw new HttpException('No cars available', 400);

    const start_date = new Date(start);
    const end_date = new Date(end);

    if (
      start_date.getDay() < 1 ||
      start_date.getDay() > 5 ||
      end_date.getDay() < 1 ||
      end_date.getDay() > 5
    ) {
      throw new HttpException('You can rent a car only on weekdays', 400);
    }

    let days = differenceInCalendarDays(end_date, start_date);

    let cost = 0;

    if (days > 29 || days <= 0) {
      throw new HttpException('Rent can only be from 1 to 29 days', 400);
    }

    if (days > 18) {
      cost += (days - 17) * (1000 - 1000 * 0.15);
      days -= days - 17;
    }
    if (days > 10) {
      cost += (days - 9) * (1000 - 1000 * 0.1);
      days -= days - 9;
    }
    if (days > 5) {
      cost += (days - 4) * (1000 - 1000 * 0.05);
      days -= days - 4;
    }

    await this.databaseService.executeQuery<BookingEntity>(
      `INSERT INTO booking_car (car_id, end_date, start_date)
      VALUES ($1, $2, $2)`,
      [car_id, end_date, start_date],
    );

    return { cost: cost + days * 1000, days };
  }
}
