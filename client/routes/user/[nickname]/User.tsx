import { Avatar, Divider, Stack, Typography } from "@mui/material";
import TimeAgo from "react-timeago";

import useUserMutation from "@hooks/mutations/useUserMutation";

import useNickname from "./useNickname";

export default function User() {
    const nickname = useNickname();
    const { data } = useUserMutation(nickname);

    return (
        <Stack flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="center">
            <Avatar src={data?.avatar} sx={{ width: 100, height: 100 }} />

            <Typography ml={1} variant="h3" sx={{ overflowWrap: "anywhere" }}>
                {data?.nickname || "Logged out"}
            </Typography>

            <Divider flexItem orientation="vertical" sx={{ mx: 2 }} />

            {data?.nickname && (
                <Stack>
                    <Typography gutterBottom>
                        created on: {new Date(data.createdAt).toLocaleDateString()}
                        {" ("}
                        <TimeAgo date={data.createdAt} />
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
