import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";

export default function Recently() {
    const { data } = useSWRInfinite((index, prev) => {
        if (prev && prev.next) return null;
        return urlCat("/recently/games", { count: 25, page: index + 1 });
    });

    return (
        <Container maxWidth="xl">
            <NextSeo title="Recent DB updates" description="The most recently added games" />

            <Typography align="center" variant="h4" my={3}>
                Recent database updates
            </Typography>

            <Typography variant="h3" align="center">
                Todo
            </Typography>

            <Typography component="pre">{JSON.stringify(data, null, 2)}</Typography>
        </Container>
    );
}
