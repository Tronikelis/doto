import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import urlCat from "urlcat";

import IconTypography from "@components/IconTypography";

import useAccountMutation from "@hooks/mutations/useAccountMutation";

import { useGame } from "./hooks";

interface WatchlistItem {
    totalCount: number;
}

export default function Watchlist() {
    const { data: game } = useGame();

    const {
        query: { slug = null },
    } = useRouter();

    const {
        data: account,
        actions: { watchlist },
    } = useAccountMutation();

    const isWatching = useMemo(() => {
        return account?.watching.find(({ slug: game }) => game === slug);
    }, [account?.watching, slug]);

    const { data, mutate } = useSWR<WatchlistItem>(
        slug && urlCat("/watchlist/item", { slug })
    );

    const add = async () => {
        if (!game) return;
        await watchlist.add({ slug: game.slug, title: game.name });
        mutate();
    };

    const del = async () => {
        if (!game) return;
        await watchlist.del(game.slug);
        mutate();
    };

    const onClick = isWatching ? del : add;

    return (
        <Stack component={Paper} p={2}>
            <IconTypography
                props={{ variant: "h5" }}
                icon={<TrackChangesIcon fontSize="large" />}
            >
                Watchlist
            </IconTypography>

            <Typography my={1}>
                {data?.totalCount} users are watching this game{" "}
                <Typography component="span" color="success.main" fontWeight={500}>
                    {isWatching && "(including you)"}
                </Typography>
            </Typography>
            <Divider />

            <Box alignSelf="flex-end" mt={1}>
                <Button onClick={onClick}>{isWatching ? "Unwatch" : "Watch"}</Button>
            </Box>
        </Stack>
    );
}
