import axios from "axios";
import urlCat from "urlcat";

import { FetchPriceProps, SearchResults } from "../types";
import { KinguinResult } from "./types";

const BASE_URL = "https://www.kinguin.net/services/library/api/v1/products/search";

const chunk = {
    platforms: 2,
    productType: 1,
    active: 0,
    hideUnavailable: 0,
    page: 0,
    size: 20,
    sort: "price.lowestOffer,ASC",
    visible: 1,
};

export const fetchPrice = async ({
    query,
    country = "LT",
    currency = "USD",
}: FetchPriceProps): Promise<SearchResults[]> => {
    const url = urlCat(BASE_URL, {
        ...chunk,
        phrase: query,
    });

    const { data } = await axios.get<KinguinResult>(url, {
        headers: { Cookie: `currency=${currency}` },
    });

    const results = data._embedded.products
        .map(({ name, attributes, imageUrl, price }) => ({
            name,
            regions: attributes.region.excludedCountries.map(x => `!${x}`),
            image: imageUrl,
            inRegion: !attributes.region.excludedCountries.includes(country),
            price: {
                amount: price.lowestOffer,
                currency,
            },
        }))
        .sort((a, b) => a.price.amount - b.price.amount);

    return results;
};
