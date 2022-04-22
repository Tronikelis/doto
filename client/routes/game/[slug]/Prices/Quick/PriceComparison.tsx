import { Link, Stack, Typography } from "@mui/material";

import { PriceComparisonProps } from "./types";

export default function PriceComparison({
    compatible,
    total,
    baseline,
}: PriceComparisonProps) {
    return (
        <Stack spacing={3} justifyContent="center" alignItems="center">
            <Stack>
                <Typography gutterBottom>↓ [all/compatible]</Typography>
                <Stack flexDirection="row" flexWrap="wrap">
                    <Typography
                        component={Link}
                        variant="h2"
                        color="success.main"
                        target="_blank"
                        href={total.lowest?.link}
                    >
                        {total.lowest?.price.amount}
                    </Typography>
                    <Typography variant="h2" color="success.main" mx={1}>
                        {"/"}
                    </Typography>
                    <Typography
                        component={Link}
                        variant="h2"
                        color="success.main"
                        target="_blank"
                        href={compatible.lowest?.link}
                    >
                        {compatible.lowest?.price.amount}
                    </Typography>
                </Stack>
            </Stack>

            <Stack>
                <Typography gutterBottom>Retail price</Typography>
                <Typography variant="h2">{baseline?.price.amount}</Typography>
            </Stack>

            <Stack>
                <Typography gutterBottom>↑ [all/compatible]</Typography>
                <Stack flexDirection="row" flexWrap="wrap">
                    <Typography
                        component={Link}
                        variant="h2"
                        color="error.main"
                        target="_blank"
                        href={total.highest?.link}
                    >
                        {total.highest?.price.amount}
                    </Typography>
                    <Typography variant="h2" color="error.main" mx={1}>
                        {"/"}
                    </Typography>
                    <Typography
                        component={Link}
                        variant="h2"
                        color="error.main"
                        target="_blank"
                        href={compatible.highest?.link}
                    >
                        {compatible.highest?.price.amount}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}
