import { Knex } from 'knex';

exports.seed = function (knex: Knex) {
  return knex('booking_car')
    .del()
    .then(function () {
      return knex('booking_car').insert([
        {
          car_id: 1,
          start_date: new Date(1656663129183),
          end_date: new Date(1657008729183),
        },
        {
          car_id: 2,
          start_date: new Date(1656922329183),
          end_date: new Date(1657267929183),
        },
        {
          car_id: 3,
          start_date: new Date(1657527129183),
          end_date: new Date(1657872729183),
        },
        {
          car_id: 4,
          start_date: new Date(1658131929183),
          end_date: new Date(1658477529183),
        },
        {
          car_id: 5,
          start_date: new Date(1658736729183),
          end_date: new Date(1659082329183),
        },
      ]);
    });
};
