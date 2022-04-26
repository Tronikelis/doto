import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { dequal } from "dequal";
import { NextSeo } from "next-seo";
import { memo, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";

import { AxiosDenuvoUpdates } from "@types";

import { SWRImmutable } from "@config";

import ResponsiveImage from "@components/ResponsiveImage";

const Item = memo(({ date, img, price, status, steam }: AxiosDenuvoUpdates["items"][0]) => {
    return (
        <Card>
            <CardActionArea LinkComponent="a" href={steam} target="_blank">
                <CardMedia sx={{ height: { xs: 100, lg: 150 } }}>
                    <ResponsiveImage src={img} />
                </CardMedia>

                <CardContent sx={{ position: "relative" }}>
                    <Typography gutterBottom>{status}</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Updated on {date}
                    </Typography>

                    {price && (
                        <Box
                            bgcolor="secondary.main"
                            position="absolute"
                            right={0}
                            bottom={0}
                            p={0.3}
                            sx={{
                                borderTopLeftRadius: ({ shape }) => `${shape.borderRadius}px`,
                                opacity: 0.85,
                            }}
                        >
                            <Typography align="center">{price}</Typography>
                        </Box>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}, dequal);

export default function DenuvoUpdates() {
    const [type, setType] = useState(0);

    const { data, setSize, error, isValidating } = useSWRInfinite<AxiosDenuvoUpdates>(
        (index, prev) => {
            if (prev && !prev.next) return null;
            return urlCat("/denuvo/updates", { page: index + 1, type });
        },
        SWRImmutable
    );

    const loading = (!error && !data) || isValidating;

    const { ref } = useInView({
        onChange: inView => {
            inView && setSize(x => x + 1);
        },
    });

    return (
        <Container maxWidth="xl">
            <NextSeo title="Denuvo updates" description="Most recent updates about denuvo" />

            <Typography variant="h4" align="center" my={3}>
                Denuvo updates
            </Typography>

            <Tabs centered value={type} onChange={(_, value) => setType(value)}>
                <Tab label="Recent updates" value={0} />
                <Tab label="New releases" value={1} />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3} alignItems="center">
                <Grid container spacing={3}>
                    {data?.map(({ items }) =>
                        items.map(item => (
                            <Grid item xs={6} md={4} lg={3} key={item.steam}>
                                <Item {...item} />
                            </Grid>
                        ))
                    )}
                </Grid>

                <Stack justifyContent="center" alignItems="center">
                    {(data?.[data?.length - 1].next || loading) && (
                        <CircularProgress ref={ref} />
                    )}
                </Stack>
            </Stack>
        </Container>
    );
}
