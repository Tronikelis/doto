import axios from "axios";
import urlCat from "urlcat";

import { SteamResult } from "./types";

const BASE_URL = "https://store.steampowered.com/api/appdetails";

interface SteamFetchProps {
    id: number;
    country?: string;
}

export const fetchPrice = async ({ id, country = "LT" }: SteamFetchProps) => {
    const url = urlCat(BASE_URL, { appids: id, cc: country.toLowerCase() });
    const { data } = await axios.get<SteamResult>(url);

    const { name, price_overview, header_image } = data[id].data;
    return {
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
