import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('booking_car', function (table) {
    table.increments('id').primary();
    table.integer('car_id').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('booking_car');
}
