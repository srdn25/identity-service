/* eslint-disable */
const { Umzug, SequelizeStorage } = require('umzug');
const { Sequelize } = require('sequelize');

const umzug = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  return new Umzug({
    migrations: {
      glob: 'src/database/migrations/*.js',
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
}

async function apply (direction, config) {
  if (!['up', 'down'].includes(direction)) {
    throw new Error(`You send not allowed direction "${direction}"`);
  }

  const count = await umzug(config)[direction]();
  if (!count.length) {
    return process.stdout.write('All migrations already applied');
  }

  process.stdout.write(`Successfully executed ${count.length} migrations ${direction}\n`);
}

module.exports = {
  apply,
  umzug,
}