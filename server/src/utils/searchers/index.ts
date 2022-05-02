import { redis } from "@redis";

import eneba from "./eneba";
import fanatical from "./fanatical";
import gmg from "./gmg";
import gog from "./gog";
import humble from "./humble";
import ig from "./ig";
import kinguin from "./kinguin";
import { FetchPriceProps } from "./types";

const searchers = [eneba, humble, kinguin, gog, ig, gmg, fanatical];

const cleanRegex = /[^\w\s]/g;
const prefix = "provider";

const hashCode = (string: string) => {
    let h = 0;
    for (let i = 0; i < string.length; i++) h = (Math.imul(31, h) + string.charCodeAt(i)) | 0;
    return h.toString();
};

export const search = async ({
    query,
    country = "LT",
    currency = "EUR",
    type,
}: FetchPriceProps) => {
    const cleanQuery = query.replace(cleanRegex, "");

    const key = hashCode([query.toLowerCase(), country, currency, type].join("-"));
    const redisResult = await redis.get(`${prefix}:${key}`);

    if (redisResult) return JSON.parse(redisResult);

    const promises = searchers.map(async ({ fetchPrice, provider }) => {
        try {
            const result = await fetchPrice({ query: cleanQuery, country, currency, type });
            return { provider, result, error: null };
        } catch (error: any) {
            return { provider, result: [], error: String(error.data || error) };
        }
    });

    const results = await Promise.all(promises);
    await redis.set(`${prefix}:${key}`, JSON.stringify(results));

    return results;
};
