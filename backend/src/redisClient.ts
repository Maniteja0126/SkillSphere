import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', 
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
})();

process.on("exit", async () => {
  await redisClient.quit();
  console.log("Redis client disconnected");
});

export default redisClient;
