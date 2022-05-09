import { Box, Stack } from "@mui/material";

import useMobile from "@hooks/useMobile";

import NotificationModal from "./NotificationModal";
import UserModal from "./UserModal";

export default function User() {
    const isMobile = useMobile();

    return (
        <Stack
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="center"
            alignItems="center"
        >
            <NotificationModal />
            <Box width={({ spacing }) => spacing(1)} />
            <UserModal />
        </Stack>
    );
}
