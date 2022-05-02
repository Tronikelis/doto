import {
    Box,
    Container,
    LinearProgress,
    Link as MuiLink,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";

import { SWRImmutable } from "@config";

import { AxiosWatchlistPopular } from "./types";

export default function WatchlistPopular() {
    const { data, error, isValidating, setSize } = useSWRInfinite<AxiosWatchlistPopular>(
        (index, prev) => {
            if (prev && !prev.next) return null;
            return urlCat("/watchlist/popular", { page: index + 1 });
        },
        SWRImmutable
    );

    const loading = (!data && !error) || isValidating;

    const { ref } = useInView({
        onChange: inView => {
            inView && setSize(x => x + 1);
        },
    });

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Most watched games
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="right">Watch count</TableCell>
                            <TableCell align="right">Slug</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data?.map(({ data }) =>
                            data.map(({ _id: game, count }) => (
                                <TableRow key={game.id}>
                                    <TableCell align="left">
                                        <NextLink href={`/game/${game.slug}`} passHref>
                                            <MuiLink underline="hover">{game.title}</MuiLink>
                                        </NextLink>
                                    </TableCell>
                                    <TableCell align="right">{count}</TableCell>
                                    <TableCell align="right">{game.slug}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {loading && <LinearProgress />}
                <Box ref={ref} />
            </TableContainer>
        </Container>
    );
}
