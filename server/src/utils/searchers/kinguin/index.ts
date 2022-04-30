import urlCat from "urlcat";

import { client } from "@utils/axios";

import Fuzzy from "../fuzzy";
import { FetchPriceProps, SearchResults } from "../types";
import { KinguinResult } from "./types";

const BASE_URL = "https://www.kinguin.net/services/library/api/v1/products/search";

const chunk = {
    // platforms: 2,
    productType: 1,
    active: 1,
    hideUnavailable: 0,
    page: 0,
    size: 20,
    sort: "price.lowestOffer,ASC",
    visible: 1,
};

const fetchPrice = async ({
    query,
    country,
    currency,
}: FetchPriceProps): Promise<SearchResults[]> => {
    const url = urlCat(BASE_URL, {
        ...chunk,
        phrase: query,
    });

    const { data } = await client.get<KinguinResult>(url, {
        headers: { Cookie: `currency=${currency}` },
    });

    const list: SearchResults[] = data._embedded.products
        .map(({ name, attributes, imageUrl, price, externalId }) => ({
            link: `https://www.kinguin.net/category/${externalId}/${attributes.urlKey}`,
            name,
            regions: attributes.region.excludedCountries.map(x => `!${x}`),
            image: imageUrl,
            inRegion: !attributes.region.excludedCountries.includes(country),
            price: {
                amount: price.lowestOffer / 100,
                currency,
            },
        }))
        .sort((a, b) => a.price.amount - b.price.amount);

    return Fuzzy({ query, list });
};

export default {
    fetchPrice,
    provider: "kinguin",
};
