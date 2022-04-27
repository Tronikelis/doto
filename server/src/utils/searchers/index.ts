import urlCat from "urlcat";

import { gameModel } from "@mongo";

import { AxiosGame } from "@types";

import { rawgClient } from "@utils/axios";
import ErrorBuilder from "@utils/errorBuilder";

import eneba from "./eneba";
import fanatical from "./fanatical";
import gmg from "./gmg";
import gog from "./gog";
import humble from "./humble";
import ig from "./ig";
import kinguin from "./kinguin";
import { FetchPriceProps, SearchResults } from "./types";

const searchers = [eneba, humble, kinguin, gog, ig, gmg, fanatical];

const cleanRegex = /[^\w\s]/g;

interface SearchResultsWProvider extends SearchResults {
    provider: string;
}

export const search = async ({
    query,
    country = "LT",
    currency = "EUR",
    filter,
    slug,
}: FetchPriceProps) => {
    // security check
    if (slug) {
        const { data: game } = await rawgClient.get<AxiosGame>(
            urlCat("/games/:slug", {
                key: process.env.RAWG_KEY,
                slug,
            })
        );

        if (game.name !== query) {
            throw new ErrorBuilder().msg("Game parameters don't add up").status(400);
        }
    }

    const cleanQuery = query.replace(cleanRegex, "");

    const promises = searchers.map(async ({ fetchPrice, provider }) => {
        try {
            const result = await fetchPrice({ query: cleanQuery, country, currency, filter });
            return { provider, result, error: null };
        } catch (error: any) {
            return { provider, result: [], error: String(error.data || error) };
        }
    });

    const results = await Promise.all(promises);

    const reduced = results.reduce((prev: any, { result, provider }) => {
        // add corresponding provider to each result
        const reduce = result?.map(x => ({ ...x, provider })) || [];
        return [...prev, ...reduce];
    }, []) as SearchResultsWProvider[];

    reduced.sort((a, b) => (a.price.amount || 0) - (b.price.amount || 0));
    const fresh = reduced[0];

    if (currency !== "EUR" || !fresh) return results;

    const lowest = {
        provider: reduced[0].provider,
        link: reduced[0].link,
        amount: Number(reduced[0].price.amount),
        date: new Date(),
    };

    const game = await gameModel.findOne({ slug });
    // update the game db if this is the lowest price
    if (game) {
        if (game.price.lowest.amount <= (fresh.price.amount || 0)) return results;
        game.price.lowest = lowest;

        await game.save();
        return results;
    } else if (slug) {
        await gameModel.create({
            price: { lowest },
            title: query,
            slug,
        });
    }

    return results;
};
