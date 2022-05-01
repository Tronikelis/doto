import axios from "axios";
import produce from "immer";
import useSWR from "swr";
import urlCat from "urlcat";

import { SWRMutate } from "@config";

interface Game {
    slug: string;
    title: string;
}

export interface Account {
    settings: {
        currency?: string | null;
        country?: string | null;
    };
    watching: Game[];
}

export default function useAccountMutation() {
    const { data, mutate } = useSWR<Account>("/account");

    const settings = {
        update: (settings: Account["settings"]) => {
            return mutate(
                axios.post("/account/settings", settings).then(x => x.data),
                {
                    ...SWRMutate,
                    optimisticData: stale =>
                        produce(stale, draft => {
                            if (!draft) return;
                            draft.settings = { ...draft.settings, ...settings };
                        }) as Account,
                }
            );
        },
        reset: () => {
            return mutate(
                axios.delete("/account/settings").then(x => x.data),
                {
                    ...SWRMutate,
                    optimisticData: {
                        settings: {
                            country: null,
                            currency: null,
                        },
                        watching: [],
                    },
                }
            );
        },
    };

    const watchlist = {
        add: (item: Game) => {
            const add = axios.put("/account/watchlist/item", { item }).then(x => x.data);

            const optimisticData = (stale?: Account) =>
                produce(stale, draft => {
                    draft?.watching.push(item);
                }) as Account;

            return mutate(add, {
                ...SWRMutate,
                optimisticData,
            });
        },
        del: (slug: string) => {
            const del = axios
                .delete(urlCat("/account/watchlist/item", { slug }))
                .then(x => x.data);

            const optimisticData = (stale?: Account) =>
                produce(stale, draft => {
                    if (!draft) return;
                    draft.watching = draft.watching.filter(
                        ({ slug }, index, games) =>
                            games.findIndex(game => game.slug === slug) === index
                    );
                }) as Account;

            return mutate(del, {
                ...SWRMutate,
                optimisticData,
            });
        },
    };

    return { data, actions: { settings, watchlist } };
}
