import { byInternet } from "country-code-lookup";
import urlCat from "urlcat";

import { client } from "@utils/axios";

import Fuzzy from "../fuzzy";
import { FetchPriceProps, SearchResults } from "../types";
import { IGResult } from "./types";

const BASE_URL = "https://qknhp8tc3y-dsn.algolia.net/1/indexes/produits_en/query";
const url = urlCat(BASE_URL, {
    "x-algolia-agent": "Algolia for vanilla JavaScript (lite) 3.24.7",
    "x-algolia-application-id": "QKNHP8TC3Y",
    "x-algolia-api-key": "4813969db52fc22897f8b84bac1299ad",
});

const fetchPrice = async ({ country, currency, query, filter }: FetchPriceProps) => {
    const { data } = await client.post<IGResult>(
        url,
        {
            params: urlCat("", {
                query,
                hitsPerPage: 20,
                filters: `(sites:ig) AND (region:Worldwide OR region:Europe OR region:${country} OR region:${currency})`,
            }),
        },
        {
            headers: {
                Referer: "https://www.instant-gaming.com/",
            },
        }
    );

    const lookup = byInternet(country);

    const list: SearchResults[] = data.hits
        .map(({ name, prod_id, seo_name, region, price }) => {
            const link = `https://www.instant-gaming.com/en/${prod_id}-buy-${seo_name}`;
            const image = `https://www.instant-gaming.com/images/products/${prod_id}/380x218/${prod_id}.jpg`;

            const inRegion =
                region === "Worldwide" ||
                Object.keys(lookup || {}).some(
                    key => (lookup as any)[key].toLowerCase() === region.toLowerCase()
                );

            return {
                name,
                link,
                image,
                inRegion,
                regions: [region],
                price: {
                    amount: price,
                    currency,
                },
            };
        })
        .sort((a, b) => a.price.amount - b.price.amount);

    return Fuzzy({ list, query, filter });
};

export default {
    fetchPrice,
    provider: "ig",
};
