import axios from "axios";
import { CacheOptions, defaultKeyGenerator, setupCache } from "axios-cache-interceptor";

import { redisStorage } from "./redis";

const headers = {
    Host: "rawg.io",
    Referer: "https://rawg.io",
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
    "X-API-Client": "website",
    "X-API-Language": "en",
    "X-API-Referer": "%2F",
};

const options: CacheOptions = {
    storage: redisStorage,
    generateKey: defaultKeyGenerator,
    interpretHeader: false,
    methods: ["get", "post"],
    // 1 week
    ttl: 1000 * 60 * 60 * 24 * 7,
};

const rawgAxios = axios.create({
    baseURL: "https://api.rawg.io/api",
    headers,
});

const cacheAxios = axios.create({
    timeout: 8_000,
    headers: { "user-agent": headers["user-agent"] },
});

const rawgClient = setupCache(rawgAxios, options);
const cacheClient = setupCache(cacheAxios, { ...options, ttl: 1000 * 60 * 60 * 2 });
const client = axios.create({
    headers: { "user-agent": headers["user-agent"] },
});

export { rawgClient, cacheClient, client };
