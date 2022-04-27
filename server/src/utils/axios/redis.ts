import { buildStorage } from "axios-cache-interceptor";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL as any);

const prefix = "axios-cache";

export const redisStorage = buildStorage({
    find: async key => {
        const result = await redis.get(`${prefix}:${key}`);
        return result && JSON.parse(result);
    },

    set: async (key, value) => {
        await redis.set(`${prefix}:${key}`, JSON.stringify(value));
    },

    remove: async key => {
        await redis.del(key);
    },
});
