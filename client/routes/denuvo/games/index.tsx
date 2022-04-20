import { Container, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

export default function Denuvo() {
    return (
        <Container maxWidth="xl">
            <NextSeo
                title="Denuvo games"
                description="Here you will find probably all denuvo games"
            />

            <Typography align="center" variant="h4" my={3}>
                Denuvo games
            </Typography>

            <Typography variant="h3" align="center">
                Todo
            </Typography>
        </Container>
    );
}
