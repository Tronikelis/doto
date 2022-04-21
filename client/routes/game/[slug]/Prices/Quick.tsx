import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";

import { Result } from "./types";

interface QuickProps {
    lowest?: Result;
    baseline?: Result;
    highest?: Result;
}

export default function Quick({ baseline, highest, lowest }: QuickProps) {
    const percents = useMemo(() => {
        const result = {
            lowest: null,
            highest: null,
        };
        if (!baseline || !highest || !lowest) return result;

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

    return (
        <Stack
            my={4}
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
        >
            <Stack>
                <Typography align="center" color="success.main">
                    [-{percents.lowest}%]
                </Typography>
                <Typography color="success.main" variant="h3">
                    {lowest?.price.amount}
                </Typography>
            </Stack>

            <Typography variant="h4" mx={2}>
                {"<"}
            </Typography>
            <Typography variant="h2">{baseline?.price.amount}</Typography>
            <Typography variant="h4" mx={2}>
                {"<"}
            </Typography>

            <Stack>
                <Typography align="center" color="error.main">
                    [+{percents.highest}%]
                </Typography>
                <Typography color="error.main" variant="h3">
                    {highest?.price.amount}
                </Typography>
            </Stack>
        </Stack>
    );
}
