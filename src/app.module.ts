import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { BookingModule } from './modules/booking/booking.module';
import { KnexModule } from 'nestjs-knex';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: {
          client: 'postgresql',
          useNullAsDefault: true,
          connection: {
            host: process.env.POSTGRES_HOST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
          },
        },
      }),
    }),
    DatabaseModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
