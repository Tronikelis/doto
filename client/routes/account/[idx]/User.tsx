import { Avatar, Divider, Stack, Typography } from "@mui/material";
import TimeAgo from "timeago-react";

import useUserMutation from "@hooks/mutations/useUserMutation";

export default function User() {
    const { data } = useUserMutation();

    return (
        <Stack flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="center">
            <Avatar src={data?.avatar} sx={{ width: 100, height: 100 }} />

            <Typography ml={1} variant="h3" sx={{ overflowWrap: "anywhere" }}>
                {data?.nickname || "Logged out"}
                <Typography color="text.secondary">
                    {data?.email || "Login to start watching games"}
                </Typography>
            </Typography>

            <Divider flexItem orientation="vertical" sx={{ mx: 2 }} />

            {data?.nickname && (
                <Stack>
                    <Typography gutterBottom>
                        created on: {new Date(data.createdAt).toLocaleDateString()}
                        {" ("}
                        <TimeAgo datetime={new Date(data.createdAt)} />
                        {")"}
                    </Typography>

                    {Object.keys(data?.attributes || {}).map(key => (
                        <Typography key={key}>
                            {key}: {String((data as any).attributes[key])}
                        </Typography>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
