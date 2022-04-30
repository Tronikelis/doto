import { useMemo } from "react";
import useSWR from "swr/immutable";
import urlCat from "urlcat";

import { AxiosGame } from "@types";

import useAccountMutation from "@hooks/mutations/useAccountMutation";

import { AxiosPriceSearch, ResultWProvider } from "./types";

interface usePricesProps {
    slug?: string | null;
    query?: string;
}

export default function usePrices({ slug = null, query }: usePricesProps) {
    const { data: game } = useSWR<AxiosGame>(slug && `/game/${slug}`);
    const { data: account } = useAccountMutation();

    const url = useMemo(() => {
        // standalone search
        if (query) {
            return urlCat("/price/search", { query, ...account?.settings });
        }

        if (!game) return null;

        const { name } = game;
        const steamUrl = game.stores.find(({ store }) => store.id === 1)?.url;
        const steamId = steamUrl && new URL(steamUrl).pathname.split("/")[2];

        return urlCat("/price/search", { steamId, query: name, ...account?.settings });
    }, [account?.settings, game, query]);

    const { data, error, isValidating } = useSWR<AxiosPriceSearch>(url);
    const loading = (!data && !error) || isValidating;

    const computed = useMemo(() => {
        if (!data) return null;

        const reduced = data.thirdParty.reduce((prev: any, { result, provider }) => {
            // add corresponding provider to each result
            const reduce = result?.map(x => ({ ...x, provider })) || [];
            return [...prev, ...reduce];
        }, []) as ResultWProvider[];

        reduced.sort((a, b) => a.price.amount - b.price.amount);

        const compatible = reduced.filter(({ inRegion }) => inRegion);

        return {
            baseline: data.baseline[0].result,
            reduced,
            total: {
                lowest: reduced[0],
                highest: reduced[reduced.length - 1],
            },
            compatible: {
                lowest: compatible[0],
                highest: compatible[compatible.length - 1],
            },
        };
    }, [data]);

    return {
        data,
        loading,
        computed,
    };
}
