import urlCat from "urlcat";

import { cacheClient } from "@utils/axios";

import { SearchResults } from "../types";
import { SteamResult } from "./types";

const BASE_URL = "https://store.steampowered.com/api/appdetails";

interface SteamFetchProps {
    id: number;
    country?: string;
}

const fetchPrice = async ({ id, country = "LT" }: SteamFetchProps): Promise<SearchResults> => {
    const url = urlCat(BASE_URL, { appids: id, cc: country.toLowerCase() });
    const { data } = await cacheClient.get<SteamResult>(url);

    const { name, price_overview, header_image } = data[id].data;
    return {
        link: `https://store.steampowered.com/app/${id}`,
        name,
        regions: ["global"],
        image: header_image,
        inRegion: true,
        price: {
            amount: price_overview.final,
            currency: price_overview.currency,
        },
    };
};

export default {
    fetchPrice,
    provider: "steam",
};
