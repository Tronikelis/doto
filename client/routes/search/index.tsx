import {
    CircularProgress,
    Container,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import ProviderProduct from "@components/ProviderProduct";

import usePrices from "@hooks/usePrices";

export default function Search() {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 800);

    const { computed, data, loading } = usePrices({ query: debouncedQuery });

    const capitalize = (string: string) => {
        const words = string.split(" ");
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Extended search ({data?.currency} {data?.country})
            </Typography>

            <TextField
                fullWidth
                value={query}
                onChange={e => setQuery(capitalize(e.target.value))}
                label="Extended search"
                variant="standard"
            />

            {loading && query && (
                <Stack justifyContent="center" alignItems="center" mt={3}>
                    <CircularProgress />
                </Stack>
            )}

            <Grid container spacing={3} sx={{ mt: 3 }}>
                {computed?.reduced.map(product => (
                    <Grid item xs={6} md={4} lg={3} xl={2} key={product.link}>
                        <ProviderProduct {...product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
