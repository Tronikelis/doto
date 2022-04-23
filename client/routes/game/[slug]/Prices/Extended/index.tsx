import { Divider, Grid, Stack, Typography } from "@mui/material";
import { memo, useMemo } from "react";

import ProviderProduct from "../ProviderProduct";
import { AxiosPriceSearch } from "../types";

interface ExtendedProps {
    data?: AxiosPriceSearch;
}

const Extended = memo(({ data }: ExtendedProps) => {
    const filtered = useMemo(
        () => data?.thirdParty.filter(({ result }) => (result?.length || -1) > 0),
        [data?.thirdParty]
    );

    const results = useMemo(
        () => filtered?.reduce((prev: any, { result }) => [...prev, ...(result || [])], []),
        [filtered]
    );

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
                Found {results?.length} results
            </Typography>

            <Grid container spacing={3}>
                {filtered?.map(({ provider, result }) =>
                    result?.map(item => (
                        <Grid item xs={12} md={6} lg={3} key={item.link}>
                            <Typography gutterBottom>{provider.toUpperCase()}</Typography>
                            <ProviderProduct {...item} />
                        </Grid>
                    ))
                )}
            </Grid>
        </Stack>
    );
});

export default Extended;
