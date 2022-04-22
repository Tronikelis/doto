import { Link, Stack, Typography } from "@mui/material";
import { memo, useMemo } from "react";

import { AxiosPriceSearch, Result } from "../types";

interface QuickProps {
    data?: AxiosPriceSearch;
}

interface IPriceComparison {
    highest?: Result | null;
    lowest?: Result | null;
}

interface PriceComparisonProps {
    total: IPriceComparison;
    compatible: IPriceComparison;
    baseline: Result | null;
}

const PriceComparison = memo(({ compatible, total, baseline }: PriceComparisonProps) => {
    if (!total.lowest && !total.highest)
        return <Typography variant="h6">{"Providers didn't find anything 🤔"}</Typography>;

    return (
        <Stack spacing={3}>
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
});

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

    const { baseline, compatible, total } = computed;

    return (
        <Stack
            my={2}
            flexWrap="wrap"
            spacing={2}
            justifyContent="space-evenly"
            alignItems="center"
        >
            <PriceComparison compatible={compatible} total={total} baseline={baseline} />
        </Stack>
    );
}
