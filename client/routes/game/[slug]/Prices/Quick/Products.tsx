import { Grid } from "@mui/material";

import ProviderProduct from "@components/ProviderProduct";

import { PriceComparisonProps } from "./types";

export default function Products({ baseline, compatible, total }: PriceComparisonProps) {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6} lg={4}>
                <ProviderProduct {...compatible.lowest} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <ProviderProduct {...total.lowest} />
            </Grid>
        </Grid>
    );
}
