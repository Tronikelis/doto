import { CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";

import usePrices from "@hooks/usePrices";

interface ContentProps {
    slug: string;
    name: string;
    genres?: string[];
}

export default function Content({ name, slug, genres = [] }: ContentProps) {
    const { computed, loading } = usePrices({ slug });

    const isLess =
        (computed?.total.lowest?.price.amount || 0) < (computed?.baseline?.price.amount || 0);

    return (
        <CardContent>
            {loading && (
                <LinearProgress
                    sx={{ position: "absolute", width: "100%", right: 0, bottom: 0 }}
                />
            )}
            <Stack flexDirection="row">
                <Typography
                    variant="h5"
                    color="primary.main"
                    sx={{ overflowWrap: "anywhere" }}
                    mr={1}
                >
                    {name}
                </Typography>
            </Stack>

            <Typography my={1}>
                {computed?.baseline?.price.amount || "🤔"}
                {" => "}
                <Typography component="span" color={isLess ? "success.main" : "error.main"}>
                    {computed?.total.lowest?.price.amount || "🤔"}
                </Typography>
            </Typography>

            <Stack flexDirection="row" flexWrap="wrap">
                {genres.map(genre => (
                    <Chip sx={{ mr: 1, my: 0.5 }} label={genre} key={genre} />
                ))}
            </Stack>
        </CardContent>
    );
}
