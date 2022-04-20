import { Container, Paper } from "@mui/material";
import { NextSeo } from "next-seo";

import useUserMutation from "@hooks/mutations/useUserMutation";

import User from "./User";

export default function Account() {
    const { user } = useUserMutation();

    return (
        <Container maxWidth="xl" sx={{ mt: 3, p: 2 }} component={Paper}>
            <NextSeo title={user?.nickname} description="Account page for Kuraku" />
            <User />
        </Container>
    );
}
