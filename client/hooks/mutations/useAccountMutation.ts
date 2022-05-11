import axios from "axios";
import produce from "immer";
import { useMemo } from "react";
import useSWR from "swr";
import urlCat from "urlcat";

import { SWRMutate } from "@config";

import useUserMutation from "./useUserMutation";

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
    owner: boolean;
}

export default function useAccountMutation(nickname?: string) {
    const { data: user } = useUserMutation(nickname);
    const url = useMemo(() => {
        if (!user && !nickname) return null;
        return urlCat("/user/info/:nickname/account", {
            nickname: nickname || user?.nickname,
        });
    }, [nickname, user]);

    const { data, mutate } = useSWR<Account>(url);

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
                    optimisticData: data =>
                        ({
                            ...data,
                            settings: {
                                country: null,
                                currency: null,
                            },
                            watching: [],
                        } as any),
                }
            );
        },
    };

    const watchlist = {
        add: (item: Game) => {
            const add = axios.put("/account/watchlist", { item }).then(x => x.data);

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
            const del = axios.delete(urlCat("/account/watchlist", { slug })).then(x => x.data);

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
