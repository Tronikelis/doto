import urlCat from "urlcat";

import { client } from "@utils/axios";

import Fuzzy from "../fuzzy";
import { FetchPriceProps, SearchResults } from "../types";
import { GogResult } from "./types";

const fetchPrice = async ({
    country,
    currency,
    query,
    filter,
}: FetchPriceProps): Promise<SearchResults[]> => {
    const { data } = await client.get<GogResult>(
        urlCat("https://catalog.gog.com/v1/catalog", {
            limit: 20,
            query: `like:${query}`,
            order: "desc:score",
            productType: "in:game,pack",
            page: 1,
            countryCode: country,
            currencyCode: currency,
        })
    );

    const list: SearchResults[] = data.products
        .map(({ title, slug, coverHorizontal, price }) => ({
            name: title,
            link: `https://www.gog.com/en/game/${slug}`.replace(/-/g, "_"),
            image: coverHorizontal,
            inRegion: true,
            regions: ["global"],
            price: {
                amount: Number(price.finalMoney.amount),
                currency,
            },
        }))
        .sort((a, b) => a.price.amount - b.price.amount);

    return Fuzzy({ list, query, filter });
};

export default {
    fetchPrice,
    provider: "gog",
};
