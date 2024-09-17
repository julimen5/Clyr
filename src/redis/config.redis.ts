import Redis from 'ioredis';
import * as process from 'node:process';
const retryStrategy = (times: number) => {
  const delay = Math.min(times * 50, 2000);
  return delay;
};
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
  retryStrategy,
};

export const redisConnection = new Redis(redisConfig);
