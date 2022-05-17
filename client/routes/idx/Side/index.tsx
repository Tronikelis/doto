import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import useSWR from "swr/immutable";
import urlCat from "urlcat";

import { AxiosThreads } from "@types";

import Thread from "@components/Thread";
import TopReddit from "@components/TopReddit";

const News = () => {
    return (
        <Stack spacing={3}>
            <TopReddit reddit="GameDeals" />
        </Stack>
    );
};

const Discuss = () => {
    const { data } = useSWR<AxiosThreads>(urlCat("/threads", { variant: "home" }));

    return (
        <Stack spacing={6}>
            {data?.data.map(({ id, root }) => (
                <Thread slug={root?.slug} key={id} />
            ))}
        </Stack>
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
