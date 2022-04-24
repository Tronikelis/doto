import axios from "axios";
import useSWR from "swr/immutable";

export interface Account {
    settings: {
        currency?: string | null;
        country?: string | null;
    };
}

export default function useAccountMutation() {
    const { data, mutate } = useSWR<Account>("/account");

    const updateSettings = (data: Account["settings"]) => {
        return mutate(
            axios.post("/account/settings", data).then(x => x.data),
            false
        );
    };

    return { data, actions: { updateSettings } };
}
