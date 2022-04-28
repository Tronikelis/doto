import urlCat from "urlcat";

import { client } from "@utils/axios";

import Fuzzy from "../fuzzy";
import { FetchPriceProps, SearchResults } from "../types";
import { FanaticalResult } from "./types";

const BASE_URL = "https://w2m9492ddv-dsn.algolia.net/1/indexes/fan_alt_rank/query";

const url = urlCat(BASE_URL, {
    "x-algolia-agent": "Algolia for JavaScript (3.35.1); Browser (lite)",
    "x-algolia-application-id": "W2M9492DDV",
});

const apiKey =
    "YjFhOTc5NzE1ZDA0NDcxYTkxZThjMzY5ZGQ0NWMwNTViMzJhOGRkYjQzNzMxMDBkZmFkMTdhNmRjMTgzMWE0ZmZpbHRlcnM9ZGlzYWJsZWQlMjAlM0QlMjAwJTIwQU5EJTIwYXZhaWxhYmxlX3ZhbGlkX2Zyb20lMjAlM0MlM0QlMjAxNjUwODk5OTQ1JTIwQU5EKGF2YWlsYWJsZV92YWxpZF91bnRpbCUyMCUzRCUyMDAlMjBPUiUyMGF2YWlsYWJsZV92YWxpZF91bnRpbCUyMCUzRSUyMDE2NTA4OTk5NDUpJmZhY2V0RmlsdGVycz0lNUIlMjJpbmNsdWRlZF9yZWdpb25zJTNBTFQlMjIlNUQmcmVzdHJpY3RJbmRpY2VzPWZhbiUyQ2Zhbl9hbHRfcmFuayUyQ2Zhbl9uYW1lJTJDZmFuX2xhdGVzdF9kZWFscyUyQ2Zhbl9kaXNjb3VudCUyQ2Zhbl9yZWxlYXNlX2RhdGVfYXNjJTJDZmFuX3JlbGVhc2VfZGF0ZV9kZXNjJTJDZmFuX3ByaWNlX2FzYyUyQ2Zhbl9wcmljZV9kZXNjJTJDZmFuX2VuZGluZ19zb29uJTJDZmFuX21vc3Rfd2FudGVkJTJDZmFuX21hbnVhbF9wcmljZV9yYW5rJTJDZmFuX2Jlc3RfcHJpY2VfcmFuayUyQ2Zhbl91bmxpbWl0ZWQ=";

const fetchPrice = async ({ currency, filter, query }: FetchPriceProps) => {
    const { data } = await client.post<FanaticalResult>(url, {
        params: urlCat("", {
            query,
            hitsPerPage: 20,
            page: 0,
            facets: JSON.stringify([`price.${currency}`]),
            facetFilters: JSON.stringify([["display_type:game"]]),
            numericFilters: JSON.stringify([`price.${currency}>0`]),
        }),
        apiKey,
    });

    const list: SearchResults[] = data.hits
        .map(({ name, cover, slug, price }) => ({
            name,
            image: `https://fanatical.imgix.net/product/original/${cover}?auto=compress,format&w=400&fit=crop&h=`,
            inRegion: false,
            regions: [],
            link: `https://www.fanatical.com/en/game/${slug}`,
            price: {
                amount: price[currency] || price.EUR,
                currency,
            },
        }))
        .sort((a, b) => a.price.amount - b.price.amount);

    return Fuzzy({ list, query, filter });
};

export default {
    fetchPrice,
    provider: "fanatical",
};
