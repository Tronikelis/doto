import ContrastIcon from "@mui/icons-material/Contrast";
import { Box, CircularProgress, Paper, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import IconTypography from "@components/IconTypography";

import usePrices from "@hooks/usePrices";

import { useGame } from "../hooks";
import Extended from "./Extended";
import Quick from "./Quick";

const Items = [Quick, Extended];

export default function Prices() {
    const { data: game } = useGame();
    const { data, loading } = usePrices({ slug: game?.slug });

    const [value, setValue] = useState(0);

    return (
        <Stack component={Paper} p={2}>
            <Stack flexDirection="row">
                <IconTypography
                    sx={{ mb: 2, mr: 2 }}
                    props={{ variant: "h5" }}
                    icon={<ContrastIcon fontSize="large" />}
                >
                    Price comparison ({data?.currency} {data?.country})
                </IconTypography>
                {loading && <CircularProgress size={30} />}
            </Stack>

            <Tabs value={value} centered onChange={(_, value) => setValue(value)}>
                <Tab label="Quick" value={0} />
                <Tab label="Extended" value={1} />
            </Tabs>

            {Items.map((Item, i) => (
                <Box key={i} hidden={i !== value}>
                    <Item />
                </Box>
            ))}
        </Stack>
    );
}
