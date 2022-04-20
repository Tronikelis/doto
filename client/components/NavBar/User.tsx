import KeyIcon from "@mui/icons-material/Key";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import {
    Avatar,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    MenuProps,
    Stack,
    Typography,
} from "@mui/material";
import Router from "next/router";
import { useState } from "react";

import ResponsiveImage from "@components/ResponsiveImage";

import useUserMutation from "@hooks/mutations/useUserMutation";

import MiscInfo from "./MiscInfo";

const UserMenu = (props: MenuProps) => {
    const { logout, user } = useUserMutation();

    const onLogout = async () => {
        await logout();
        Router.push("/auth/login");
    };

    const onLogin = () => Router.push("/auth/login");
    const onRecover = () => Router.push("/auth/recover/generate");

    return (
        <Menu
            {...props}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            <Typography align="center">{user?.nickname || "Logged out"}</Typography>
            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={onRecover}>
                <ListItemIcon>
                    <KeyIcon />
                </ListItemIcon>
                Reset password
            </MenuItem>

            {user?.nickname ? (
                <MenuItem onClick={onLogout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            ) : (
                <MenuItem onClick={onLogin}>
                    <ListItemIcon>
                        <LockOpenIcon />
                    </ListItemIcon>
                    Login
                </MenuItem>
            )}

            <Divider sx={{ my: 1 }} />

            <MiscInfo />
        </Menu>
    );
};

export default function User() {
    const { user } = useUserMutation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = !!anchorEl;

    return (
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <Avatar alt={user?.nickname}>
                    {user?.avatar && <ResponsiveImage src={user.avatar} />}
                </Avatar>
            </IconButton>

            <UserMenu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
        </Stack>
    );
}
