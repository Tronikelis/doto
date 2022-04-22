import { Link, Stack, Typography } from "@mui/material";
import { memo, useMemo } from "react";

import useMobile from "@hooks/useMobile";

import { AxiosPriceSearch, Result } from "./types";

interface QuickProps {
    data?: AxiosPriceSearch;
}

interface ComparisonProps {
    highest?: Result | null;
    baseline?: Result | null;
    lowest?: Result | null;
}

const Comparison = memo(({ baseline, highest, lowest }: ComparisonProps) => {
    const percents = useMemo(() => {
        const result = {
            lowest: null,
            highest: null,
        };
        if (!baseline || !lowest || !highest) return result;

        const lowestBase = Math.abs(lowest.price.amount / baseline.price.amount - 1) * 100;
        const highestBase = Math.abs(highest.price.amount / baseline.price.amount - 1) * 100;

        const lowestClean =
            Math.floor(lowestBase) === lowestBase ? lowestBase : lowestBase.toFixed(1);
        const highestClean =
            Math.floor(highestBase) === highestBase ? highestBase : highestBase.toFixed(1);

        return {
            lowest: Number(lowestClean),
            highest: Number(highestClean),
        };
    }, [baseline, highest, lowest]);

    const isMobile = useMobile();

    const variantLR = isMobile ? "h6" : "h3";
    const variantM = isMobile ? "h5" : "h2";

    if (!lowest || !highest)
        return <Typography variant="h5">{"This game wasn't found 🤔"}</Typography>;

    return (
        <Stack
            flexDirection={isMobile ? "column" : "row"}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
        >
            {lowest.price.amount <= (baseline?.price.amount || Infinity) && (
                <>
                    <Stack>
                        <Typography variant="body2" align="center" color="success.main">
                            [-{percents.lowest}%]
                        </Typography>

                        <Typography
                            variant={variantLR}
                            component={Link}
                            target="_blank"
                            href={lowest.link}
                            sx={{
                                color: "success.main",
                                cursor: "pointer",
                            }}
                        >
                            {lowest.price.amount}
                        </Typography>
                    </Stack>

                    <Typography variant={variantLR} mx={2}>
                        {isMobile ? "^" : "<"}
                    </Typography>
                </>
            )}

            <Typography variant={variantM}>{baseline?.price.amount || "X"}</Typography>

            {highest.price.amount >= (baseline?.price.amount || -Infinity) && (
                <>
                    <Typography variant={variantLR} mx={2}>
                        {isMobile ? "^" : "<"}
                    </Typography>

                    <Stack>
                        <Typography variant="body2" align="center" color="error.main">
                            [+{percents.highest}%]
                        </Typography>

                        <Typography
                            variant={variantLR}
                            component={Link}
                            target="_blank"
                            href={highest.link}
                            sx={{
                                color: "error.main",
                                cursor: "pointer",
                            }}
                        >
                            {highest.price.amount}
                        </Typography>
                    </Stack>
                </>
            )}
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
            <Stack justifyContent="center" alignItems="center" m={2}>
                <Typography variant="h6" gutterBottom>
                    All results
                </Typography>
                <Comparison
                    baseline={baseline}
                    highest={total.highest}
                    lowest={total.lowest}
                />
            </Stack>

            <Stack justifyContent="center" alignItems="center" m={2}>
                <Typography variant="h6" gutterBottom>
                    Region compatible
                </Typography>
                <Comparison
                    baseline={baseline}
                    highest={compatible.highest}
                    lowest={compatible.lowest}
                />
            </Stack>
        </Stack>
    );
}
