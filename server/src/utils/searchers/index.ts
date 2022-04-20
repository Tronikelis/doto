import eneba from "./eneba";
import humble from "./humble";
import kinguin from "./kinguin";
import { FetchPriceProps } from "./types";

const searchers = [eneba, humble, kinguin];

export const search = ({ query, country = "LT", currency = "USD" }: FetchPriceProps) => {
    const promises = searchers.map(async ({ fetchPrice, provider }) => {
        const result = await fetchPrice({ query, country, currency });
        return { provider, result };
    });

    return Promise.all(promises);
};
