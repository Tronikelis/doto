import { keyframes } from "@emotion/react";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Avatar,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import TimeAgo from "react-timeago";
import useSWR from "swr/immutable";
import urlCat from "urlcat";

import useUserMutation from "@hooks/mutations/useUserMutation";
import snack from "@hooks/useSnack";

import useNickname from "./useNickname";

const rainbow = keyframes`
    0% {
        color: #A0D468;
    }

    20% {
        color: #4FC1E9;
    }
  
    40% {
        color: #FFCE54;
    }
  
    60% {
        color: #FC6E51;
    }
  
    80% {
        color: #ED5565;
    }
  
    100% {
        color: #AC92EC;
    }
`;

const MiscMenu = () => {
    const nickname = useNickname();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { data: user } = useUserMutation(nickname);
    const { data: own } = useUserMutation();

    const onDelete = async () => {
        if (
            !confirm(
                "Are you sure (this will delete everything associated with your account) ?"
            )
        )
            return;

        await axios.post("/user/ban", { id: user?.id });
        snack.success("Account deleted");
    };

    const onReport = async () => {
        await axios.post("/report/create", {
            type: "user",
            typeId: user?.id,
            summary: user?.nickname,
        });
        snack.success("Account reported");
    };

    return (
        <>
            <Menu
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                {(user?.owner || own?.attributes?.admin) && (
                    <MenuItem onClick={onDelete}>Delete account</MenuItem>
                )}
                <MenuItem onClick={onReport}>Report account</MenuItem>
            </Menu>

            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
            </IconButton>
        </>
    );
};

export default function User() {
    const nickname = useNickname();
    const { data } = useUserMutation(nickname);

    const { data: karma } = useSWR(
        nickname && urlCat("/user/info/:nickname/karma", { nickname })
    );

    return (
        <Stack p={2} flexWrap="wrap" component={Paper}>
            <Stack flexDirection="row" alignItems="center">
                <Avatar src={data?.avatar} sx={{ width: 60, height: 60 }} />

                <Typography ml={1} variant="h4" sx={{ overflowWrap: "anywhere" }}>
                    {data?.nickname || "Logged out"}

                    {data?.nickname && (
                        <Typography>
                            <TimeAgo
                                date={data.createdAt}
                                formatter={(value, unit) => `${value} ${unit}s old`}
                            />
                            {" · "}
                            <Typography component="span" color="text.secondary">
                                {new Date(data.createdAt).toLocaleDateString()}
                            </Typography>
                        </Typography>
                    )}
                </Typography>

                <Stack flex={1} alignItems="flex-end">
                    <MiscMenu />
                </Stack>
            </Stack>

            <Divider flexItem sx={{ my: 2 }} />

            {data?.nickname && (
                <Stack spacing={1}>
                    <Typography variant="button">
                        karma:{" "}
                        <Typography
                            component="span"
                            sx={{ animation: `${rainbow} 8s linear infinite` }}
                        >
                            {karma?.karma}
                        </Typography>
                    </Typography>

                    {Object.keys(data?.attributes || {}).map(key => (
                        <Stack flexDirection="row" key={key} alignItems="center">
                            <Typography variant="button" mr={0.5}>
                                {key}:{" "}
                            </Typography>

                            {(data as any).attributes[key] ? (
                                <CheckCircleIcon color="success" />
                            ) : (
                                <CancelIcon color="error" />
                            )}
                        </Stack>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
