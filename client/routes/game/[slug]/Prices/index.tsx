import { Box, Paper, Stack, Typography } from "@mui/material";
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
        const steamUrl = game.stores.find(({ store }) => store.id === 1)?.url;
        const steamId = steamUrl && new URL(steamUrl).pathname.split("/")[2];

        return urlCat("/price/search", { steamId, query });
    }, [game]);

    const { data } = useSWR<AxiosPriceSearch>(url);

    return (
        <Box component={Paper}>
            <Stack>
                <Typography variant="h6">Baseline</Typography>
                {data?.baseline.map(({ provider, result }) => (
                    <Stack key={provider}>
                        <Typography my={2}>{provider.toUpperCase()}</Typography>
                        <Typography>
                            {result.name} - {result.price.amount}
                        </Typography>
                    </Stack>
                ))}
            </Stack>

            <Stack my={4}>
                <Typography variant="h6">Third party</Typography>
                {data?.thirdParty.map(({ provider, result }) => {
                    return (
                        <Stack key={provider}>
                            <Typography my={2}>{provider.toUpperCase()}</Typography>
                            <Stack>
                                {result.map(({ name, price, link }) => (
                                    <Typography key={link}>
                                        {name} - {price.amount}
                                    </Typography>
                                ))}
                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>
        </Box>
    );
}
