import { Box, Link as MuiLink, Stack, Tab, Tabs, Typography } from "@mui/material";
import NextLink from "next/link";
import { useState } from "react";
import urlCat from "urlcat";

import Thread from "@components/Thread";
import TopReddit from "@components/TopReddit";

import useUserMutation from "@hooks/mutations/useUserMutation";

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
    const { data } = useUserMutation();

    return (
        <Box>
            {data?.attributes?.admin && (
                <NextLink href={urlCat("/create/thread", { slug: "/" })} passHref>
                    <MuiLink>Create thread</MuiLink>
                </NextLink>
            )}
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
