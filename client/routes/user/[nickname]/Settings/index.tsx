import { Stack } from "@mui/material";

import Country from "./Country";

export default function Settings() {
    return (
        <Stack p={2} flexDirection="row" flexWrap="wrap" justifyContent="space-around">
            <Country />
        </Stack>
    );
}
