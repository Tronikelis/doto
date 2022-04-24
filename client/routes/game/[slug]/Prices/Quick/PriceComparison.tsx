import { Link, Stack, Typography } from "@mui/material";

import { ResultWProvider } from "@hooks/usePrices/types";

import { PriceComparisonProps } from "./types";

interface PriceLinkProps {
    data?: ResultWProvider | null;
    color: string;
}

const PriceLink = ({ data, color }: PriceLinkProps) => {
    return (
        <Typography
            component={Link}
            variant="h2"
            color={color}
            target="_blank"
            href={data?.link}
        >
            {data?.price.amount}
        </Typography>
    );
};

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
                    <PriceLink data={total.lowest} color="success.main" />
                    <Typography variant="h2" color="success.main" mx={1}>
                        {"/"}
                    </Typography>
                    <PriceLink data={compatible.lowest} color="success.main" />
                </Stack>
            </Stack>

            <Stack>
                <Typography gutterBottom>Retail price</Typography>
                <Typography variant="h2">{baseline?.price.amount}</Typography>
            </Stack>

            <Stack>
                <Typography gutterBottom>↑ [all/compatible]</Typography>
                <Stack flexDirection="row" flexWrap="wrap">
                    <PriceLink data={total.highest} color="error.main" />
                    <Typography variant="h2" color="error.main" mx={1}>
                        {"/"}
                    </Typography>
                    <PriceLink data={compatible.highest} color="error.main" />
                </Stack>
            </Stack>
        </Stack>
    );
}
