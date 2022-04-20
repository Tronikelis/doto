import { Container, Grid } from "@mui/material";
import { NextSeo } from "next-seo";

import BackToTop from "./BackToTop";
import Games from "./Games";
import Side from "./Side";

export default function Index() {
    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <NextSeo
                title="Home"
                description="Kuraku is an open source website that ONLY shows the status of game cracks"
            />

            <Grid container spacing={6}>
                <Grid item xs={12} md={4} xl={3}>
                    <Side />
                </Grid>

                <Grid item xs>
                    <Games />
                </Grid>
            </Grid>

            <BackToTop />
        </Container>
    );
}
