import { Stack, Typography } from "@mui/material";

import { AxiosPriceSearch } from "./types";

interface ExtendedProps {
    data?: AxiosPriceSearch;
}

export default function Extended({ data }: ExtendedProps) {
    return (
        <Stack>
            <Stack>
                <Typography variant="h6">Baseline</Typography>
                {data?.baseline.map(({ provider, result }) => (
                    <Stack key={provider}>
                        <Typography my={2}>{provider.toUpperCase()}</Typography>
                        <Typography>
                            {result?.name} - {result?.price.amount}
                        </Typography>
                    </Stack>
                ))}
            </Stack>

            <Stack my={4}>
                <Typography variant="h6">Third party</Typography>
                {data?.thirdParty.map(({ provider, result }) => {
                    return (
                        <Stack key={provider}>
                            <Typography my={2}>{provider.toUpperCase()}</Typography>
                            <Stack>
                                {result?.map(({ name, price, link }) => (
                                    <Typography key={link}>
                                        {name} - {price.amount}
                                    </Typography>
                                ))}
                            </Stack>
                        </Stack>
                    );
                })}
            </Stack>
        </Stack>
    );
}
