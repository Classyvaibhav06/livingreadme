import IORedis from "ioredis";

const isTls =
  process.env.REDIS_TLS === "true" ||
  (process.env.REDIS_HOST && process.env.REDIS_HOST.includes("upstash.io"));

const REDIS_CONFIG = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME || "default",
      ...(isTls ? { tls: { rejectUnauthorized: false } } : {}),
      maxRetriesPerRequest: null,
    };

// Analytics cache client
export const redis = new IORedis(REDIS_CONFIG);

// readme-generation + cleanup queues/workers
export const readmeConnection = new IORedis(REDIS_CONFIG);

// email-broadcast queue/worker
export const emailConnection = new IORedis(REDIS_CONFIG);
