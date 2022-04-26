import urlCat from "urlcat";

import { cacheClient } from "@utils/axios";

import Fuzzy from "../fuzzy";
import { FetchPriceProps, SearchResults } from "../types";
import { GMGResult, Regions } from "./types";

const BASE_URL = "https://sczizsp09z-dsn.algolia.net/1/indexes/*/queries";

const url = urlCat(BASE_URL, {
    "x-algolia-agent":
        "Algolia for JavaScript (4.5.1); Browser (lite); instantsearch.js (4.8.3); JS Helper (3.2.2)",
    "x-algolia-api-key": "3bc4cebab2aa8cddab9e9a3cfad5aef3",
    "x-algolia-application-id": "SCZIZSP09Z",
});

const fetchPrice = async ({ country, currency, query, filter }: FetchPriceProps) => {
    const { data } = await cacheClient.post<GMGResult>(url, {
        requests: [
            {
                indexName: `prod_ProductSearch_LI_${country}`,
                params: urlCat("", {
                    query,
                    ruleContexts: JSON.stringify([
                        currency,
                        country,
                        `${currency}_${country}`,
                    ]),
                    filters: `IsSellable:true AND IsDlc:false`,
                    hitsPerPage: 20,
                    page: 0,
                    distinct: true,
                    maxValuesPerFacet: 10,
                }),
            },
        ],
    });

    const getAmount = (regions: Regions) => {
        const keys = Object.keys(regions);
        const key = keys[keys.length - 1] as keyof typeof regions;
        return regions[key]?.Mrp || regions[key]?.Drp || regions[key]?.Rrp;
    };

    const list: SearchResults[] = data.results[0].hits
        .map(({ DisplayName, ImageUrl, ExcludeCountryCodes, Url, Regions }) => ({
            name: DisplayName,
            image: `https://images.greenmangaming.com${ImageUrl}`,
            inRegion: !ExcludeCountryCodes?.includes(country),
            regions: ExcludeCountryCodes?.map(x => `!${x}`) || [],
            link: `https://www.greenmangaming.com${Url}`,
            price: {
                amount: getAmount(Regions),
                currency,
            },
        }))
        .sort((a, b) => a.price.amount - b.price.amount);

    return Fuzzy({ list, query, filter });
};

export default {
    fetchPrice,
    provider: "gmg",
};
