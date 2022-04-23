import ContrastIcon from "@mui/icons-material/Contrast";
import { Box, CircularProgress, Paper, Stack, Tab, Tabs } from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr/immutable";
import urlCat from "urlcat";

import IconTypography from "@components/IconTypography";

import { useGame } from "../hooks";
import Extended from "./Extended";
import Quick from "./Quick";
import { AxiosPriceSearch } from "./types";

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

    const { data, error, isValidating } = useSWR<AxiosPriceSearch>(url);
    const loading = (!data && !error) || isValidating;

    return (
        <Stack component={Paper} p={2}>
            <Stack flexDirection="row">
                <IconTypography
                    sx={{ mb: 2, mr: 2 }}
                    props={{ variant: "h5" }}
                    icon={<ContrastIcon fontSize="large" />}
                >
                    Price comparison ({data?.currency} {data?.country})
                </IconTypography>
                {loading && <CircularProgress size={30} />}
            </Stack>

            <Tabs value={value} centered onChange={(_, value) => setValue(value)}>
                <Tab label="Quick" value={0} />
                <Tab label="Extended" value={1} />
            </Tabs>

            {Items.map((Item, i) => (
                <Box key={i} hidden={i !== value}>
                    <Item data={data} />
                </Box>
            ))}
        </Stack>
    );
}
