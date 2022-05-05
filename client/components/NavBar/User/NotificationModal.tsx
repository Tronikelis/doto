import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
    Avatar,
    Badge,
    Box,
    Divider,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    Stack,
    Typography,
} from "@mui/material";
import Router from "next/router";
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

    const onClick = (id: string, href: string) => {
        // read the notification here
        Router.push(href);
    };

    return (
        <Box>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unread} color="error">
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
                            data.map(({ id, title, date, summary, sender, read, href }) => (
                                <ListItemButton
                                    key={id}
                                    alignItems="flex-start"
                                    sx={{ opacity: read ? 0.5 : 1 }}
                                    onClick={() => onClick(id, href)}
                                >
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
                                </ListItemButton>
                            ))
                        )}
                    </List>
                </Stack>
            </Menu>
        </Box>
    );
}
