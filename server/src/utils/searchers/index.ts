import eneba from "./eneba";
import gmg from "./gmg";
import gog from "./gog";
import humble from "./humble";
import ig from "./ig";
import kinguin from "./kinguin";
import { FetchPriceProps } from "./types";

const searchers = [eneba, humble, kinguin, gog, ig, gmg];

const cleanRegex = /[^\w\s]/g;

export const search = ({
    query,
    country = "LT",
    currency = "EUR",
    filter,
}: FetchPriceProps) => {
    const cleanQuery = query.replace(cleanRegex, "");

    const promises = searchers.map(async ({ fetchPrice, provider }) => {
        try {
            const result = await fetchPrice({ query: cleanQuery, country, currency, filter });
            return { provider, result, error: null };
        } catch (error) {
            return { provider, result: [], error: String(error) };
        }
    });

    return Promise.all(promises);
};
