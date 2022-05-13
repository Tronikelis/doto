import KeyIcon from "@mui/icons-material/Key";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    MenuProps,
    Typography,
} from "@mui/material";
import axios from "axios";
import Router from "next/router";
import { useState } from "react";

import ResponsiveImage from "@components/ResponsiveImage";

import useUserMutation from "@hooks/mutations/useUserMutation";
import snack from "@hooks/useSnack";

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
    const onRegister = () => Router.push("/auth/register");
    const onAccount = () => Router.push(`/user/${data?.nickname}`);
    const onRecover = () => Router.push("/auth/recover/generate");

    const [loading, setLoading] = useState(false);

    const onVerify = async () => {
        setLoading(true);
        await axios.post("/auth/account/verify");
        setLoading(false);
        snack.success("Sent an email, check your inbox!");
    };

    return (
        <Menu
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            {...props}
        >
            <Typography align="center">{data?.nickname || "Logged out"}</Typography>
            <Divider sx={{ my: 1 }} />

            <MenuItem disabled={!data?.nickname} onClick={onAccount}>
                <ListItemIcon>
                    <ManageAccountsIcon />
                </ListItemIcon>
                Profile
            </MenuItem>

            <MenuItem onClick={onRecover}>
                <ListItemIcon>
                    <KeyIcon />
                </ListItemIcon>
                Reset password
            </MenuItem>

            {!data?.attributes?.verified && data && (
                <MenuItem onClick={onVerify} disabled={loading}>
                    <ListItemIcon>
                        <VerifiedIcon />
                    </ListItemIcon>
                    Verify account
                </MenuItem>
            )}

            {data?.nickname ? (
                <MenuItem onClick={onLogout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            ) : (
                <div>
                    <MenuItem onClick={onLogin}>
                        <ListItemIcon>
                            <LockOpenIcon />
                        </ListItemIcon>
                        Login
                    </MenuItem>
                    <MenuItem onClick={onRegister}>
                        <ListItemIcon>
                            <LockIcon />
                        </ListItemIcon>
                        Register
                    </MenuItem>
                </div>
            )}

            <Divider sx={{ my: 1 }} />

            <MiscInfo />
        </Menu>
    );
};

export default function UserModal() {
    const { data } = useUserMutation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = !!anchorEl;

    return (
        <Box>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <Avatar alt={data?.nickname}>
                    {data?.avatar && <ResponsiveImage src={data.avatar} />}
                </Avatar>
            </IconButton>

            <UserMenu open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
        </Box>
    );
}
