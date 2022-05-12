import { Box, Container, Grid, Paper, Stack, Tab, Tabs } from "@mui/material";
import { NextSeo } from "next-seo";
import { useState } from "react";

import useUserMutation from "@hooks/mutations/useUserMutation";

import Settings from "./Settings";
import User from "./User";
import Watchlist from "./Watchlist";
import useNickname from "./useNickname";

const Items = [Watchlist, Settings];

export default function UserPage() {
    const nickname = useNickname();
    const { data } = useUserMutation(nickname);

    const [value, setValue] = useState(0);

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <NextSeo title={data?.nickname || "Account"} description="Account page for Doto" />

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Stack component={Paper}>
                        <Tabs value={value} centered onChange={(_, value) => setValue(value)}>
                            <Tab label="Watchlist" value={0} />
                            {data?.owner && <Tab label="Settings" value={1} />}
                        </Tabs>

                        {Items.map((Item, i) => (
                            <Box key={i} mt={2}>
                                {i === value && <Item />}
                            </Box>
                        ))}
                    </Stack>
                </Grid>

                <Grid item xs>
                    <User />
                </Grid>
            </Grid>
        </Container>
    );
}
