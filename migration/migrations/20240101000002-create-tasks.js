'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Tasks');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tasks_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tasks_priority";');
  },
};
