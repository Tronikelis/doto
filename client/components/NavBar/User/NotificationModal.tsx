import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
    Avatar,
    Badge,
    Box,
    CircularProgress,
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
import axios from "axios";
import Router from "next/router";
import { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import TimeAgo from "react-timeago";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";

import ResponsiveImage from "@components/ResponsiveImage";

import useLoggedIn from "@hooks/useLoggedIn";

import { AxiosNotifications, Datum } from "./types";

interface TopBarProps {
    onReadAll: () => void;
}

const TopBar = ({ onReadAll }: TopBarProps) => {
    return (
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography>Notifications</Typography>

            <IconButton size="small" onClick={onReadAll}>
                <MarkEmailReadIcon fontSize="small" />
            </IconButton>
        </Stack>
    );
};

export default function NotificationModal() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const loggedIn = useLoggedIn();

    const { data, mutate, setSize } = useSWRInfinite<AxiosNotifications>((index, prev) => {
        if (prev && !prev.next) return null;
        return urlCat("/user/notifications", { page: index + 1 });
    });
    const more = data && data[data.length - 1].next;

    const { ref } = useInView({
        onChange: inView => {
            inView && setSize(x => x + 1);
        },
    });

    const unread = useMemo(() => {
        const items = data?.reduce((prev: any, { data }) => [...prev, ...data], []) as Datum[];
        return items?.filter(x => !x.read).length;
    }, [data]);

    const onRead = async (id: string, href: string) => {
        Router.push(urlCat("/thread/:href", { href }));
        await axios.post("/user/notifications/read", { id });
        mutate();
    };

    const onReadAll = async () => {
        await axios.post("/user/notifications/readall");
        mutate();
    };

    return (
        <Box>
            <IconButton disabled={!loggedIn} onClick={e => setAnchorEl(e.currentTarget)}>
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
                <Stack mx={2} justifyContent="center">
                    <TopBar onReadAll={onReadAll} />
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
                                    onClick={() => onRead(id, href)}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ResponsiveImage src={sender?.avatar} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography>
                                                {`${
                                                    sender?.nickname || "[deleted]"
                                                }: ${title} - `}
                                                <Typography
                                                    component="span"
                                                    color="text.secondary"
                                                >
                                                    <TimeAgo date={date} />
                                                </Typography>
                                            </Typography>
                                        }
                                        secondary={`${summary}...`}
                                    />
                                </ListItemButton>
                            ))
                        )}
                    </List>

                    {more && (
                        <CircularProgress ref={ref} sx={{ alignSelf: "center", mb: 1 }} />
                    )}
                </Stack>
            </Menu>
        </Box>
    );
}
