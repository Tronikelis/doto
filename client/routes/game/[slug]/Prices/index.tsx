import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import useSWR from "swr/immutable";
import urlCat from "urlcat";

import { useGame } from "../hooks";
import { AxiosPriceSearch } from "./types";

export default function Prices() {
    const { data: game } = useGame();

    const url = useMemo(() => {
        if (!game) return null;

        const query = game.name;
        const steamId = game.stores
            .find(({ store }) => store.id === 1)
            ?.url.replace(/\D/g, "");

        return urlCat("/price/search", { steamId, query });
    }, [game]);

    const { data } = useSWR<AxiosPriceSearch>(url);

    return (
        <Box component={Paper}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
    );
}
