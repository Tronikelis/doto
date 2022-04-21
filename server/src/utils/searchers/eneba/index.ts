import { byInternet } from "country-code-lookup";

import { cacheClient } from "@utils/axios";

import Fuzzy from "../fuzzy";
import { FetchPriceProps, SearchResults } from "../types";
import { EnebaResult } from "./types";

const chunk = {
    currency: "USD",
    searchType: "DEFAULT",
    platforms: ["STEAM"],
    types: ["game"],
    regions: [
        "argentina",
        "asia",
        "canada",
        "emea",
        "europe",
        "france",
        "germany",
        "global",
        "italy",
        "latam",
        "lithuania",
        "mexico",
        "middle_east",
        "netherlands",
        "north_america",
        "spain",
        "turkey",
        "united_kingdom",
        "united_states",
    ],
    sortBy: "POPULARITY_DESC",
    first: 20,
    price: { currency: "USD" },
    url: ":P",
    redirectUrl: ":P",
};

const extensions = {
    persistedQuery: {
        version: 1,
        sha256Hash: "fe31a6cdef096386ed3d398a4cfc7f80a68088f5e8eed4e7d6d46480af604fad",
    },
};

const fetchPrice = async ({
    query,
    country,
    currency,
}: FetchPriceProps): Promise<SearchResults[]> => {
    const variables = {
        ...chunk,
        text: query,
        currency,
        price: { currency },
    };

    const url = `https://www.eneba.com/graphql/?operationName=Store&variables=${JSON.stringify(
        variables
    )}&extensions=${JSON.stringify(extensions)}`;

    const { data } = await cacheClient.get<EnebaResult>(url);

    const lookup = byInternet(country);

    const list = data.data.search.results.edges
        .filter(({ node }) => !!node.cheapestAuction)

        .map(({ node }) => ({
            link: `https://eneba.com/${node.slug}`,
            name: node.name,
            regions: node.regions.map(({ code }) => code),
            image: node.cover.src,
            price: {
                ...node.cheapestAuction?.price,
                amount: (node.cheapestAuction?.price.amount || 0) / 100,
                __typename: undefined,
            },
        }))

        .map(({ regions, ...rest }) => {
            if (regions.includes("global")) return { ...rest, regions, inRegion: true };
            if (!lookup) return { ...rest, regions, inRegion: false };

            return {
                ...rest,
                regions,
                inRegion: Object.keys(lookup).some(key =>
                    regions
                        .map(x => x.toLowerCase())
                        .includes(lookup[key as keyof typeof lookup].toLowerCase())
                ),
            };
        })

        .sort((a, b) => a.price.amount - b.price.amount);

    return Fuzzy({ query, list: list as any }) as any as SearchResults[];
};

export default {
    fetchPrice,
    provider: "eneba",
};
