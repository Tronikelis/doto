import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpIcon from "@mui/icons-material/Help";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { dequal } from "dequal";
import { memo } from "react";

import ResponsiveImage from "@components/ResponsiveImage";

import { ResultWProvider } from "@hooks/usePrices/types";

const ProviderProduct = ({
    image,
    link,
    name,
    price,
    inRegion,
    provider,
}: Partial<ResultWProvider>) => {
    return (
        <Card variant="outlined">
            <CardActionArea LinkComponent="a" target="_blank" href={link || ""}>
                <CardMedia sx={{ height: 100 }}>
                    <ResponsiveImage src={image} />
                </CardMedia>

                <CardContent>
                    <Stack flexDirection="row" flexWrap="wrap" alignItems="center">
                        <Typography variant="h6" mr={0.5}>
                            {price?.amount}
                        </Typography>
                        {inRegion ? (
                            <CheckCircleIcon color="success" />
                        ) : (
                            <HelpIcon color="warning" />
                        )}
                    </Stack>

                    <Typography mt={0.5}>{name}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography>From {provider}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default memo(ProviderProduct, dequal);
