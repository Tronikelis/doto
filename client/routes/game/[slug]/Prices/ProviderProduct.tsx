import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";

import ResponsiveImage from "@components/ResponsiveImage";

import { ResultWProvider } from "@hooks/usePrices/types";

export default function ProviderProduct({
    image,
    link,
    name,
    price,
    inRegion,
    provider,
}: Partial<ResultWProvider>) {
    return (
        <Card variant="outlined">
            <CardActionArea LinkComponent="a" href={link || ""} target="_blank">
                <CardMedia sx={{ height: 150 }}>
                    <ResponsiveImage src={image} />
                </CardMedia>

                <CardContent>
                    <Typography gutterBottom variant="h6">
                        {name}
                    </Typography>

                    <Typography gutterBottom>
                        {price?.amount} {price?.currency}
                    </Typography>

                    {provider && <Typography>From {provider.toUpperCase()}</Typography>}
                    <Typography component="i">
                        {inRegion
                            ? "Compatible"
                            : "Possible that it won't work in your region"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
