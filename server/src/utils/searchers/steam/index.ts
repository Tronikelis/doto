import urlCat from "urlcat";

import { cacheClient } from "@utils/axios";

import { SearchResults } from "../types";
import { SteamResult } from "./types";

const BASE_URL = "https://store.steampowered.com/api/appdetails";

interface SteamFetchProps {
    id: number;
    country: string;
    currency: string;
}

const fetchPrice = async ({
    id,
    country,
    currency,
}: SteamFetchProps): Promise<SearchResults> => {
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
            amount: price_overview ? price_overview.final / 100 : null,
            currency: price_overview ? price_overview.currency : currency,
        },
    };
};

export default {
    fetchPrice,
    provider: "steam",
};
