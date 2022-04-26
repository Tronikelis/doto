import { AppBar, Box, Container, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { memo } from "react";

import Links from "./Links";
import Title from "./Title";
import User from "./User";

const Search = dynamic(() => import("./Search"));

function NavBar() {
    return (
        <AppBar position="relative">
            <Container maxWidth="xl">
                <Stack
                    p={1}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack flexDirection="row" justifyContent="center" alignItems="center">
                        <Links />
                        <Box width={10} />
                        <Title />
                    </Stack>
                    <Search />
                    <User />
                </Stack>
            </Container>
        </AppBar>
    );
}

export default memo(NavBar);
