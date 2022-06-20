import * as redis from "redis";

export let redisClient: redis.RedisClientType;

export const setupRedis = async () => {
  redisClient = redis.createClient({
    legacyMode: true,
    url: "redis://localhost:6379",
    password: "redis",
  });

  await redisClient.connect();

  redisClient.on("connect", () => {
    console.log("Redis client connected");
  });

  redisClient.on("error", () => {
    console.error("Error: Redis client failed");
  });
};
