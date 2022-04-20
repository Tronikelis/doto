import urlCat from "urlcat";

import { cacheClient } from "@utils/axios";

import { FetchPriceProps, SearchResults } from "../types";
import { HumbleResult } from "./types";

const BASE_URL =
    "https://ayszewdaz2-dsn.algolia.net/1/indexes/replica_product_query_site_search/query";

const url = urlCat(BASE_URL, {
    "x-algolia-agent": "Algolia for vanilla JavaScript 3.24.5",
    "x-algolia-application-id": "AYSZEWDAZ2",
    "x-algolia-api-key": "5229f8b3dec4b8ad265ad17ead42cb7f",
});

const fetchPrice = async ({
    query,
    // country = "LT",
    currency = "USD",
}: FetchPriceProps): Promise<SearchResults[]> => {
    const { data } = await cacheClient.post<HumbleResult>(url, {
        params: urlCat("", {
            query,
            hitsPerPage: 20,
            page: 0,
        }),
    });

    const results = data.hits
        .map(({ localized_prices, human_name, storefront_icon }) => ({
            name: human_name,
            regions: ["global"],
            image: storefront_icon,
            price: {
                amount: Number(
                    localized_prices[currency].current_price.toString().replace(/\./g, "")
                ),
                currency,
            },
            inRegion: true,
        }))
        .sort((a, b) => a.price.amount - b.price.amount);

    return results;
};

export default {
    fetchPrice,
    provider: "humble",
};