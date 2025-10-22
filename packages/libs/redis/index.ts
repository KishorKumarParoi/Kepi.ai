import { createClient, type RedisClientType } from 'redis';
import path from "path";
import dotenv from "dotenv";

// Load .env from workspace root using NX_WORKSPACE_ROOT
dotenv.config({
  path: path.join(process.env.NX_WORKSPACE_ROOT ?? process.cwd(), ".env"),
});

let client: RedisClientType | undefined;

export async function getRedis(): Promise<RedisClientType> {
  if (client?.isOpen) {
    return client;
  }

  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error("REDIS_URL not configured in .env");
  }

  client = createClient({ url });

  client.on('error', (err) => console.error('Redis Client Error:', err));

  if (!client.isOpen) {
    await client.connect();
    console.log('✅ Redis connected successfully');
  }

  return client;
}

export async function quitRedis() {
  if (client?.isOpen) {
    await client.quit();
    console.log('Redis connection closed');
  }
}

// Don't create top-level connections or default export
