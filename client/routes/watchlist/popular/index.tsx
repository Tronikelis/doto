import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import useSWR from "swr/immutable";

import { AxiosWatchlistPopular } from "./types";

export default function WatchlistPopular() {
    const { data } = useSWR<AxiosWatchlistPopular>("/watchlist/popular");

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
                Most watched games
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Watch count</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Slug</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data?.data.map(({ _id: game, count }) => (
                            <TableRow key={game.id}>
                                <TableCell align="left">{count}</TableCell>
                                <TableCell align="right">{game.title}</TableCell>
                                <TableCell align="right">{game.slug}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
