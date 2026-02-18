import app from './app';
import sequelize from './config/database';
import env from './config/env';
import redis from './config/redis';
import logger from './utils/logger';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    // Ensure Redis connection
    if (redis.status === 'ready') {
      logger.info('Redis ready');
    }

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Server startup failed', { error });
    process.exit(1);
  }
};

startServer();
