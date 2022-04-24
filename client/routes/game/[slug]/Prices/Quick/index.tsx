import { Grid, Typography } from "@mui/material";
import { memo } from "react";

import usePrices from "@hooks/usePrices";

import { useGame } from "../../hooks";
import PriceComparison from "./PriceComparison";
import Products from "./Products";

const Quick = memo(() => {
    const { data: game } = useGame();
    const { computed } = usePrices({ slug: game?.slug });

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
});

export default Quick;
