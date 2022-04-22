import ContrastIcon from "@mui/icons-material/Contrast";
import { Box, Divider, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr/immutable";
import urlCat from "urlcat";

import IconTypography from "@components/IconTypography";

import { useGame } from "../hooks";
import Extended from "./Extended";
import Quick from "./Quick";
import { AxiosPriceSearch, Result } from "./types";

const steamSVG = "https://cdn.akamai.steamstatic.com/store/about/icon-steamos.svg";

const Items = [Quick, Extended];

export default function Prices() {
    const { data: game } = useGame();

    const [value, setValue] = useState(0);

    const url = useMemo(() => {
        if (!game) return null;

        const query = game.name;
        const steamUrl = game.stores.find(({ store }) => store.id === 1)?.url;
        const steamId = steamUrl && new URL(steamUrl).pathname.split("/")[2];

        return urlCat("/price/search", { steamId, query });
    }, [game]);

    const { data } = useSWR<AxiosPriceSearch>(url);

    // do something with the region locks (display it somehow)
    const contrast = useMemo(() => {
        if (!data) return null;

        const reduced = data.thirdParty.reduce(
            (prev: any, { result }) => [...prev, ...result],
            []
        ) as Result[];

        reduced.sort((a, b) => a.price.amount - b.price.amount);

        return {
            lowest: reduced[0],
            highest: reduced[reduced.length - 1],
            baseline: data.baseline[0].result,
        };
    }, [data]);

    return (
        <Stack component={Paper} p={2}>
            <IconTypography
                sx={{ mb: 2 }}
                props={{ variant: "h5" }}
                icon={<ContrastIcon fontSize="large" />}
            >
                Price comparison ({data?.currency} {data?.country})
            </IconTypography>

            <Tabs value={value} centered onChange={(_, value) => setValue(value)}>
                <Tab label="Quick" value={0} />
                <Tab label="Extended" value={1} />
            </Tabs>

            {Items.map((Item, i) => (
                <Box key={i} hidden={i !== value}>
                    <Item
                        data={data}
                        lowest={contrast?.lowest}
                        highest={contrast?.highest}
                        baseline={contrast?.baseline}
                    />
                </Box>
            ))}

            {/* <Stack>
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

            <Stack>
                <Typography>Cheapest</Typography>
                <pre>{JSON.stringify(contrast, null, 2)}</pre>
            </Stack> */}
        </Stack>
    );
}
