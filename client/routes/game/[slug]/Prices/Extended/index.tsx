import { Divider, Grid, Stack, Typography } from "@mui/material";
import { memo } from "react";

import usePrices from "@hooks/usePrices";

import { useGame } from "../../hooks";
import ProviderProduct from "../ProviderProduct";

const Extended = memo(() => {
    const { data: game } = useGame();
    const { computed, data } = usePrices({ slug: game?.slug });

    return (
        <Stack>
            <Stack>
                <Typography variant="h4">Retail</Typography>
                {data?.baseline.map(({ provider, result }) => (
                    <Typography key={provider} mt={1} variant="h6">
                        {provider.toUpperCase()}: {result?.name} - {result?.price.amount}
                    </Typography>
                ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography mb={2} variant="h6">
                Found {computed?.reduced.length} results
            </Typography>

            <Grid container spacing={3}>
                {computed?.reduced?.map(item => (
                    <Grid item xs={12} md={6} lg={3} key={item.link}>
                        <ProviderProduct {...item} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
});

export default Extended;
