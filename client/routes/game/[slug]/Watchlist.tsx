import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
import urlCat from "urlcat";

import IconTypography from "@components/IconTypography";

interface WatchlistItem {
    totalCount: number;
}

export default function Watchlist() {
    const {
        query: { slug = null },
    } = useRouter();

    const { data } = useSWR<WatchlistItem>(
        slug && urlCat("/account/watchlist/item", { slug })
    );

    return (
        <Stack component={Paper} p={2}>
            <IconTypography
                props={{ variant: "h5" }}
                icon={<TrackChangesIcon fontSize="large" />}
            >
                Watchlist
            </IconTypography>

            <Typography my={1}>{data?.totalCount} users are watching this game</Typography>
            <Divider />

            <Box alignSelf="flex-end" mt={1}>
                <Button>Watch</Button>
            </Box>
        </Stack>
    );
}
