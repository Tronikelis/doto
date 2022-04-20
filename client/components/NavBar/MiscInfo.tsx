import { Box, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr/immutable";

import useInterval from "@hooks/useInterval";

import onServer from "@utils/onServer";

export default function MiscInfo() {
    const { data: weather, error } = useSWR<string>("https://wttr.in/?format=1");
    const loading = !weather && !error;

    const [time, setTime] = useState(new Date());
    const locale = onServer() ? "en-US" : window.navigator.language;

    useInterval(() => {
        setTime(new Date());
    }, 5000);

    return (
        <Box px={2}>
            <Typography align="center" gutterBottom>
                Some info
            </Typography>

            <Typography>
                <Typography component="span" color="text.secondary">
                    Time:{" "}
                </Typography>
                {time.toLocaleTimeString(locale)}
            </Typography>

            <Typography>
                <Typography component="span" color="text.secondary">
                    Weather: {loading && "loading"}
                </Typography>
                {weather}
            </Typography>
        </Box>
    );
}
