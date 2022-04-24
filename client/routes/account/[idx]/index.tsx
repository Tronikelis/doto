import { Box, Container, Divider, Paper, Tab, Tabs } from "@mui/material";
import { NextSeo } from "next-seo";
import { useState } from "react";

import useUserMutation from "@hooks/mutations/useUserMutation";

import Settings from "./Settings";
import User from "./User";

const Items = [Settings];

export default function Account() {
    const { data } = useUserMutation();

    const [value, setValue] = useState(0);

    return (
        <Container maxWidth="xl" sx={{ mt: 3, p: 2 }} component={Paper}>
            <NextSeo title={data?.nickname} description="Account page for Doto" />
            <User />

            <Divider sx={{ my: 2 }} />

            <Tabs value={value} centered onChange={(_, value) => setValue(value)}>
                <Tab label="Settings" value={0} />
            </Tabs>

            {Items.map((Item, i) => (
                <Box key={i} hidden={i !== value} mt={2}>
                    <Item />
                </Box>
            ))}
        </Container>
    );
}
