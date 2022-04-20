import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

export default function Recently() {
    return (
        <Container maxWidth="xl">
            <NextSeo
                title="Denuvo games"
                description="Here you will find probably all denuvo games"
            />

            <Typography align="center" variant="h4" my={3}>
                Recent database updates
            </Typography>

            <Typography variant="h3" align="center">
                Todo
            </Typography>
        </Container>
    );
}
