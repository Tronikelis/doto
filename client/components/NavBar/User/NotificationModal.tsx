import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";

import { SWRImmutable } from "@config";

import { AxiosNotifications, Datum } from "./types";

export default function NotificationModal() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const { data } = useSWRInfinite<AxiosNotifications>((index, prev) => {
        if (prev && !prev.next) return null;
        return urlCat("/user/notifications", { page: index + 1, count: 25 });
    }, SWRImmutable);

    const unread = useMemo(() => {
        const items = data?.reduce((prev: any, { data }) => [...prev, data], []) as Datum[];
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
                sx={{ maxHeight: 450 }}
            >
                <Typography align="center">Notifications</Typography>
                <Divider sx={{ my: 1 }} />

                {data?.map(({ data }) =>
                    data.map(({ id, title }) => <MenuItem key={id}>{title}</MenuItem>)
                )}
            </Menu>
        </Box>
    );
}
