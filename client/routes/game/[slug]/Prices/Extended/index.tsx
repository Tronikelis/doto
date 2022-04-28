import { Divider, Grid, Stack, Typography } from "@mui/material";
import { memo } from "react";

import ProviderProduct from "@components/ProviderProduct";

import usePrices from "@hooks/usePrices";

import { useGame } from "../../hooks";

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
                    <Grid item xs={6} md={4} lg={3} xl={2} key={item.link}>
                        <ProviderProduct {...item} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
});

export default Extended;
