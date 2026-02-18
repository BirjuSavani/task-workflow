import redis from '../config/redis';

export const cacheGet = async (key: string): Promise<string | null> => {
  return redis.get(key);
};

export const cacheSet = async (key: string, value: string, ttlSeconds = 60): Promise<void> => {
  await redis.set(key, value, 'EX', ttlSeconds);
};

export const cacheInvalidate = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
