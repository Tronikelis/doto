import { Box, Stack } from "@mui/material";

import NotificationModal from "./NotificationModal";
import UserModal from "./UserModal";

export default function User() {
    return (
        <Stack flexDirection="row" justifyContent="center" alignItems="center">
            <NotificationModal />
            <Box width={({ spacing }) => spacing(1)} />
            <UserModal />
        </Stack>
    );
}
