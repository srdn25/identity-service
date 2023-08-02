/* eslint-disable */
require('dotenv').config({
    path: '.dev.env'
})

require('./migrate')
  .umzug({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  })
  .runAsCLI();
