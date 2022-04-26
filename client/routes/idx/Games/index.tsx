import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import { dequal } from "dequal";
import { useInView } from "react-intersection-observer";
import { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";
import { useDebounce } from "use-debounce";
import { useSnapshot } from "valtio";

import { AxiosGames } from "@types";

import GameCard from "@components/GameCard";

import Filters from "./Filters";
import { computedQuery } from "./store";

export default function Index() {
    const query = useSnapshot(computedQuery);

    const [debouncedQuery] = useDebounce(query, 500, { equalityFn: dequal });

    const { fallback } = useSWRConfig();

    // this hook doesn't pick up the fallback auto hmm...
    const { data, setSize } = useSWRInfinite<AxiosGames>(
        (index, previous) => {
            if (previous && !previous.next) return null;
            return urlCat("/games", { ...debouncedQuery, page: index + 1 });
        },
        { fallbackData: [fallback.games] }
    );

    const { ref } = useInView({
        onChange: inView => {
            inView && setSize(x => x + 1);
        },
    });

    return (
        <Stack flex={1}>
            <Box mb={3}>
                <Filters />
            </Box>

            <Grid container spacing={3}>
                {data?.map(({ results }) =>
                    results.map(({ id, name, background_image, clip, genres, slug }) => (
                        <Grid item xs={12} md={6} lg={4} xl={3} key={id}>
                            <GameCard
                                genres={genres.map(x => x.name)}
                                video={clip?.clip}
                                img={background_image}
                                name={name}
                                slug={slug}
                                animations
                            />
                        </Grid>
                    ))
                )}
            </Grid>

            {!data && (
                <Stack p={3} justifyContent="center" alignItems="center" mt={1}>
                    <CircularProgress />
                </Stack>
            )}

            {data?.[data.length - 1]?.next && (
                <Stack p={3} justifyContent="center" alignItems="center" mt={1}>
                    <div ref={data ? ref : undefined}>
                        <CircularProgress />
                    </div>
                </Stack>
            )}
        </Stack>
    );
}
