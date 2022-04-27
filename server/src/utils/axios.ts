import axios from "axios";
import {
    CacheOptions,
    buildMemoryStorage,
    defaultKeyGenerator,
    setupCache,
} from "axios-cache-interceptor";

const headers = {
    Host: "rawg.io",
    Referer: "https://rawg.io",
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0",
    "X-API-Client": "website",
    "X-API-Language": "en",
    "X-API-Referer": "%2F",
};

const options: CacheOptions = {
    storage: buildMemoryStorage(),
    generateKey: defaultKeyGenerator,
    interpretHeader: false,
    methods: ["get", "post"],
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
const cacheClient = setupCache(cacheAxios, options);

export { rawgClient, cacheClient };
