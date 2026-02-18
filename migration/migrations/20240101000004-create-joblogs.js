'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobLogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      jobId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      queueName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jobName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('started', 'completed', 'failed'),
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('JobLogs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_JobLogs_status";');
  },
};
