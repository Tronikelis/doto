import KeyIcon from "@mui/icons-material/Key";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
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
    const {
        actions: { logout },
        data,
    } = useUserMutation();

    const onLogout = async () => {
        await logout();
        Router.push("/auth/login");
    };

    const onLogin = () => Router.push("/auth/login");
    const onAccount = () => Router.push("/account");
    const onRecover = () => Router.push("/auth/recover/generate");

    return (
        <Menu
            {...props}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            <Typography align="center">{data?.nickname || "Logged out"}</Typography>
            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={onAccount}>
                <ListItemIcon>
                    <ManageAccountsIcon />
                </ListItemIcon>
                Account
            </MenuItem>

            <MenuItem onClick={onRecover}>
                <ListItemIcon>
                    <KeyIcon />
                </ListItemIcon>
                Reset password
            </MenuItem>

            {data?.nickname ? (
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
    const { data } = useUserMutation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = !!anchorEl;

    return (
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <Avatar alt={data?.nickname}>
                    {data?.avatar && <ResponsiveImage src={data.avatar} />}
                </Avatar>
            </IconButton>

            <UserMenu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
        </Stack>
    );
}
