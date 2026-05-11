import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};

export const followUpQueue = new Queue("follow-up-queue", {
  redis: redisOptions,
});