import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
    Avatar,
    Badge,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    Stack,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import TimeAgo from "timeago-react";
import urlCat from "urlcat";

import ResponsiveImage from "@components/ResponsiveImage";

import { AxiosNotifications, Datum } from "./types";

const TopBar = () => {
    return (
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>Notifications</Typography>

            <IconButton size="small">
                <MarkEmailReadIcon fontSize="small" />
            </IconButton>
        </Stack>
    );
};

export default function NotificationModal() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { data } = useSWRInfinite<AxiosNotifications>((index, prev) => {
        if (prev && !prev.next) return null;
        return urlCat("/user/notifications", { page: index + 1, count: 25 });
    });

    const unread = useMemo(() => {
        const items = data?.reduce((prev: any, { data }) => [...prev, ...data], []) as Datum[];
        return items?.filter(x => !x.read).length;
    }, [data]);

    return (
        <Box>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unread} color="primary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                sx={{ maxHeight: 650 }}
            >
                <Stack mx={2}>
                    <TopBar />
                    <Divider sx={{ my: 1 }} />

                    {data && unread < 1 && (
                        <Typography align="center">Nothing to be seen here</Typography>
                    )}

                    <List disablePadding sx={{ width: "100%", maxWidth: 360 }}>
                        {data?.map(({ data }) =>
                            data.map(({ id, title, date, summary, sender }) => (
                                <ListItem key={id} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ResponsiveImage src={sender.avatar} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography>
                                                {title}
                                                {" - "}
                                                <Typography
                                                    component="span"
                                                    color="text.secondary"
                                                >
                                                    <TimeAgo datetime={new Date(date)} />
                                                </Typography>
                                            </Typography>
                                        }
                                        secondary={summary + "..."}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Stack>
            </Menu>
        </Box>
    );
}
