import { createClient } from 'redis';

// Configure Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

let isConnected = false;

export const connectRedis = async () => {
  if (!isConnected) {
    try {
      await redisClient.connect();
      isConnected = true;
      console.log('Connected to Redis cache');
    } catch (err) {
      console.error('Failed to connect to Redis', err);
    }
  }
};

export const getCache = async (key) => {
  if (!isConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis Get Error:', err);
    return null;
  }
};

export const setCache = async (key, value, expirationInSeconds = 3600) => {
  if (!isConnected) return;
  try {
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(value));
  } catch (err) {
    console.error('Redis Set Error:', err);
  }
};

export const clearCachePrefix = async (prefix) => {
  if (!isConnected) return;
  try {
    const keys = await redisClient.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error('Redis Clear Error:', err);
  }
};

export const clearExactCache = async (key) => {
  if (!isConnected) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis Clear Error:', err);
  }
};

export default redisClient;