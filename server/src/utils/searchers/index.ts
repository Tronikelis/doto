import eneba from "./eneba";
import gog from "./gog";
import humble from "./humble";
import ig from "./ig";
import kinguin from "./kinguin";
import { FetchPriceProps } from "./types";

const searchers = [eneba, humble, kinguin, gog, ig];

export const search = ({ query, country = "LT", currency = "EUR" }: FetchPriceProps) => {
    const promises = searchers.map(async ({ fetchPrice, provider }) => {
        try {
            const result = await fetchPrice({ query, country, currency });
            return { provider, result, error: null };
        } catch (error) {
            return { provider, result: [], error: String(error) };
        }
    });

    return Promise.all(promises);
};
