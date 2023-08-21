'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.sequelize.query(`
    INSERT INTO provider_type_tbl (name) VALUES ('Telegram')
  `);
  },

  async down({ context: queryInterface }) {
    await queryInterface.sequelize.query(`
    DELETE FROM provider_type_tbl as pt WHERE pt.name = 'Telegram'
  `);
  },
};
