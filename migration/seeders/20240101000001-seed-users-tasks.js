'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userId = uuidv4();

    // Insert user
    await queryInterface.bulkInsert('Users', [
      {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert tasks
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    const tasks = [];

    for (let i = 0; i < 200; i++) {
      tasks.push({
        id: uuidv4(),
        userId: userId,
        title: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Tasks', tasks);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Tasks', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
