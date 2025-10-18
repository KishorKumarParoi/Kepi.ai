// import { createClient } from "redis"
// import path from "path";
// import dotenv from "dotenv";

// // Load .env from workspace root
// dotenv.config({
//   path: path.join("../../../.env"),
// });

// const client = createClient({
//   url: process.env.REDIS_URL
// });

// console.log(process.env.REDIS_URL);

// client.on("error", function (err) {
//   throw err;
// });
// await client.connect()
// await client.set('foo', 'bar');

// // Disconnect after usage
// await client.disconnect();

import { createClient } from 'redis';
import path from "path";
import dotenv from "dotenv";

// Load .env from workspace root
dotenv.config({
  path: path.join("../../../.env"),
});

const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  }
});


// redis.on('error', err => console.log('Redis redis Error', err));

// await redis.connect();

// await redis.set('foo', 'bar');
// const result = await redis.get('foo');
// console.log(result)  // >>> bar

export default redis
