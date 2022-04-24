import {
    CardContent,
    Chip,
    CircularProgress,
    Link as MuiLink,
    Stack,
    Typography,
} from "@mui/material";
import NextLink from "next/link";

import usePrices from "@hooks/usePrices";

interface ContentProps {
    slug: string;
    name: string;
    genres?: string[];
}

export default function Content({ name, slug, genres = [] }: ContentProps) {
    const { computed, loading } = usePrices({ slug });

    return (
        <CardContent>
            <Stack flexDirection="row">
                <NextLink href={`/game/${slug}`} passHref>
                    <Typography
                        variant="h5"
                        component={MuiLink}
                        underline="none"
                        mr={1}
                        sx={{
                            overflowWrap: "anywhere",
                            "&:hover": {
                                cursor: "pointer",
                                color: "text.secondary",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                </NextLink>
                {loading && <CircularProgress color="secondary" size={28} />}
            </Stack>

            <Typography my={1}>
                {computed?.baseline?.price.amount || "🤔"}
                {" => "}
                <Typography component="span" color="success.main">
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
