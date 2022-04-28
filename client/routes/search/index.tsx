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

import useAccountMutation from "@hooks/mutations/useAccountMutation";
import usePrices from "@hooks/usePrices";

export default function Search() {
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 800);

    const { data: account } = useAccountMutation();
    const { computed, data, loading } = usePrices({ query: debouncedQuery });

    const currency = account?.settings.currency || data?.currency;
    const country = account?.settings.country || data?.country;

    const capitalize = (string: string) => {
        const words = string.split(" ");
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Extended search ({currency} {country})
            </Typography>

            <TextField
                fullWidth
                value={query}
                onChange={e => setQuery(capitalize(e.target.value))}
                label="Extended search"
                variant="standard"
            />

            {computed && (
                <Typography mt={2}>Found {computed.reduced.length} results</Typography>
            )}

            {loading && query && (
                <Stack justifyContent="center" alignItems="center" mt={3}>
                    <CircularProgress />
                </Stack>
            )}

            <Grid container spacing={3} sx={{ mt: 0 }}>
                {computed?.reduced.map(product => (
                    <Grid item xs={6} md={4} lg={3} xl={2} key={product.link}>
                        <ProviderProduct {...product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
