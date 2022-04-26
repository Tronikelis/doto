import { Container, Grid } from "@mui/material";
import { NextSeo } from "next-seo";

import ResponsiveImage from "@components/ResponsiveImage";

import Description from "./Description";
import Media from "./Media";
import Prices from "./Prices";
import Reviews from "./Reviews";
import { useGame } from "./hooks";

export default function Game() {
    const { data } = useGame();

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            <NextSeo
                title={data?.name + " - Price comparison"}
                description={data?.description_raw}
                openGraph={{
                    images: [{ url: data?.background_image_additional || "" }],
                }}
                twitter={{
                    cardType: "summary_large_image",
                }}
            />

            <ResponsiveImage
                src={data?.background_image}
                props={{
                    sx: {
                        filter: "blur(10px)",
                        maskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 95%)",
                    },
                    zIndex: -1,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    minWidth: "100%",
                    minHeight: "100%",
                }}
            />

            <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                    <Media />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Description />
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Reviews />
                </Grid>

                <Grid item xs={12} md={12} lg={9}>
                    <Prices />
                </Grid>
            </Grid>
        </Container>
    );
}
