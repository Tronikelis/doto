import CloseIcon from "@mui/icons-material/Close";
import DangerousIcon from "@mui/icons-material/Dangerous";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import {
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

interface Link {
    name: string;
    href: string;
    icon: any;
    nested?: Link[] | null;
}

const links: Link[] = [
    {
        name: "Home",
        href: "/",
        icon: <HomeIcon />,
        nested: null,
    },
    {
        name: "Recently",
        href: "/recently",
        icon: <TimelapseIcon />,
        nested: null,
    },
    {
        name: "Denuvo",
        href: "/denuvo/updates",
        icon: <DangerousIcon />,
        nested: null,
    },
];

const LinkListItem = ({
    href,
    icon,
    name,
    nested,
    onClose,
}: Link & { onClose: () => void }) => {
    const { route } = useRouter();

    const [open, setOpen] = useState(false);

    const toggle = () => {
        nested && setOpen(x => !x);
    };

    if (!nested) {
        return (
            <NextLink href={href} passHref>
                <ListItemButton onClick={onClose} selected={href === route} LinkComponent="a">
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={name} />
                </ListItemButton>
            </NextLink>
        );
    }

    return (
        <>
            <ListItemButton onClick={toggle}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding>
                    {nested.map(({ href, icon, name }) => (
                        <NextLink href={href} passHref key={href}>
                            <ListItemButton
                                selected={href === route}
                                onClick={onClose}
                                LinkComponent="a"
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={name} />
                            </ListItemButton>
                        </NextLink>
                    ))}
                </List>
            </Collapse>
        </>
    );
};

export default function Links() {
    const [open, setOpen] = useState(false);

    const onClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
            <IconButton onClick={() => setOpen(x => !x)}>
                <MenuIcon />
            </IconButton>

            <Drawer anchor="left" open={open} onClose={onClose}>
                <Stack flexDirection="row" my={1} alignItems="center" justifyContent="center">
                    <Typography pl={5} flex={1} align="center">
                        Doto
                    </Typography>

                    <Stack alignItems="flex-end" mr={1}>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Stack>

                <Divider />

                <List sx={{ width: { xs: "60vw", lg: 250 } }}>
                    {links.map(link => (
                        <LinkListItem {...link} onClose={onClose} key={link.href} />
                    ))}
                    <Divider sx={{ my: 1 }} />

                    <ListItem disableGutters disablePadding>
                        <NextLink href="https://github.com/Tronikelis/doto" passHref>
                            <ListItemButton LinkComponent="a">
                                <ListItemIcon>
                                    <GitHubIcon />
                                </ListItemIcon>
                                <ListItemText primary="GitHub" />
                            </ListItemButton>
                        </NextLink>
                    </ListItem>
                </List>
            </Drawer>
        </Stack>
    );
}
