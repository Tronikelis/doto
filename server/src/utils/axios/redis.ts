import { buildStorage } from "axios-cache-interceptor";

import { redis } from "@redis";

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
