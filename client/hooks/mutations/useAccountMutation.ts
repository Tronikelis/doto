import axios from "axios";
import useSWR from "swr/immutable";

import { SWRMutate } from "@config";

export interface Account {
    settings: {
        currency?: string | null;
        country?: string | null;
        filter?: string | null;
    };
}

export default function useAccountMutation() {
    const { data, mutate } = useSWR<Account>("/account");

    const updateSettings = (settings: Account["settings"]) => {
        return mutate(
            axios.post("/account/settings", settings).then(x => x.data),
            {
                ...SWRMutate,
                optimisticData: stale => ({ settings: { ...stale?.settings, ...settings } }),
            }
        );
    };

    const resetSettings = () => {
        return mutate(
            axios.delete("/account/settings").then(x => x.data),
            {
                ...SWRMutate,
                optimisticData: {
                    settings: {
                        country: null,
                        currency: null,
                        filter: null,
                    },
                },
            }
        );
    };

    return { data, actions: { updateSettings, resetSettings } };
}