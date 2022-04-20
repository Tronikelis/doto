import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import Thread from "@components/Thread";
import TopReddit from "@components/TopReddit";

const News = () => {
    return (
        <Stack spacing={3}>
            <TopReddit reddit="GameDeals" />
            <TopReddit reddit="gaming" />
            <TopReddit reddit="pcmasterrace" />
        </Stack>
    );
};

const Discuss = () => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Discuss
            </Typography>
            <Thread />
        </Box>
    );
};

export default function Side() {
    const [value, setValue] = useState(0);
    return (
        <>
            <Tabs centered value={value} onChange={(_, value) => setValue(value)}>
                <Tab label="News" value={0} />
                <Tab label="Discuss" value={1} />
            </Tabs>

            {[News, Discuss].map((Item, index) => (
                <Box hidden={index !== value} mt={2} key={index}>
                    <Item />
                </Box>
            ))}
        </>
    );
}
