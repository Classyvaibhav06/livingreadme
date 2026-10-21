import IORedis from "ioredis";

const isTls =
  process.env.REDIS_TLS === "true" ||
  (process.env.REDIS_URL && process.env.REDIS_URL.startsWith("rediss://")) ||
  (process.env.REDIS_HOST && process.env.REDIS_HOST.includes("upstash.io")) ||
  (process.env.REDIS_URL && process.env.REDIS_URL.includes("upstash.io"));

function createRedisConnection() {
  if (process.env.REDIS_URL) {
    return new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      ...(isTls ? { tls: { rejectUnauthorized: false } } : {}),
    });
  }

  return new IORedis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME || "default",
    ...(isTls ? { tls: { rejectUnauthorized: false } } : {}),
    maxRetriesPerRequest: null,
  });
}

// Analytics cache client
export const redis = createRedisConnection();

// readme-generation + cleanup queues/workers
export const readmeConnection = createRedisConnection();

// email-broadcast queue/worker
export const emailConnection = createRedisConnection();
