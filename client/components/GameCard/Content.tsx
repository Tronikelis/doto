import { CardContent, Chip, Link as MuiLink, Stack, Typography } from "@mui/material";
import NextLink from "next/link";

interface ContentProps {
    slug: string;
    name: string;
    genres?: string[];
}

export default function Content({ name, slug, genres = [] }: ContentProps) {
    return (
        <CardContent>
            <Stack
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Stack flexDirection="row" alignItems="center" justifyContent="center">
                    <NextLink href={`/game/${slug}`} passHref>
                        <Typography
                            variant="h5"
                            component={MuiLink}
                            underline="none"
                            mr={0.5}
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
                </Stack>
            </Stack>

            <Stack flexDirection="row" flexWrap="wrap" mt={1}>
                {genres.map(genre => (
                    <Chip sx={{ mr: 1, my: 0.5 }} label={genre} key={genre} />
                ))}
            </Stack>
        </CardContent>
    );
}
