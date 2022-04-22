import { Grid, Typography } from "@mui/material";
import { useMemo } from "react";

import { AxiosPriceSearch, Result } from "../types";
import PriceComparison from "./PriceComparison";
import Products from "./Products";

interface QuickProps {
    data?: AxiosPriceSearch;
}

export default function Quick({ data }: QuickProps) {
    const computed = useMemo(() => {
        if (!data) return null;

        const reduced = data.thirdParty.reduce(
            (prev: any, { result }) => [...prev, ...(result || [])],
            []
        ) as Result[];

        reduced.sort((a, b) => a.price.amount - b.price.amount);

        const compatible = reduced.filter(({ inRegion }) => inRegion);

        return {
            baseline: data.baseline[0].result,
            total: {
                lowest: reduced[0],
                highest: reduced[reduced.length - 1],
            },
            compatible: {
                lowest: compatible[0],
                highest: compatible[compatible.length - 1],
            },
        };
    }, [data]);

    if (!computed) return <></>;
    if (!computed.total.highest || !computed.total.lowest)
        return (
            <Typography my={2} align="center" variant="h4">
                {"Providers don't have this game 🤔"}
            </Typography>
        );

    return (
        <Grid mt={2} spacing={2} container justifyContent="center" alignItems="center">
            <Grid item xs={12} lg={6}>
                <PriceComparison {...computed} />
            </Grid>
            <Grid item xs={12} lg={6}>
                <Products {...computed} />
            </Grid>
        </Grid>
    );
}
