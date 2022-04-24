import { Box, Stack } from "@mui/material";

import Country from "./Country";
import Filter from "./Filter";

export default function Settings() {
    return (
        <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-around">
            <Country />
            <Filter />
        </Stack>
    );
}
