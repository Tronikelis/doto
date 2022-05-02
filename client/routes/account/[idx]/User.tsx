import EditIcon from "@mui/icons-material/Edit";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Dialog,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import TimeAgo from "timeago-react";

import useUserMutation from "@hooks/mutations/useUserMutation";

interface EditDialogProps {
    open: boolean;
    onClose: () => any;
}

const EditDialog = ({ open, onClose }: EditDialogProps) => {
    const {
        actions: { changeAvatar },
    } = useUserMutation();

    const [value, setValue] = useState("");

    return (
        <Dialog open={open} onClose={onClose}>
            <Stack p={4}>
                <Typography variant="h5">Change avatar</Typography>

                <Stack my={2} alignItems="flex-end">
                    <TextField
                        fullWidth
                        label="RAW img URL *"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                    <Box mt={1}>
                        <Button onClick={() => changeAvatar(value)}>Change</Button>
                    </Box>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                    {
                        '* Upload your photo to discord and paste the photo link, the link should look like this: "https://cdn.discordapp.com/....". It would be best if the photos would be less than 1MB and not sketchy'
                    }
                </Typography>
            </Stack>
        </Dialog>
    );
};

export default function User() {
    const { data } = useUserMutation();

    const [open, setOpen] = useState(false);

    return (
        <Stack flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="center">
            <Badge
                overlap="circular"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                badgeContent={<EditIcon />}
            >
                <IconButton onClick={() => setOpen(true)}>
                    <Avatar src={data?.avatar} sx={{ width: 100, height: 100 }} />
                </IconButton>

                {/** opens this */}
                <EditDialog open={open} onClose={() => setOpen(false)} />
            </Badge>

            <Typography ml={1} variant="h3" sx={{ overflowWrap: "anywhere" }}>
                {data?.nickname || "Logged out"}
                <Typography color="text.secondary">
                    {data?.email || "Login to start watching games"}
                </Typography>
            </Typography>

            <Divider flexItem orientation="vertical" sx={{ mx: 2 }} />

            {data?.nickname && (
                <Stack>
                    <Typography gutterBottom>
                        created on: {new Date(data.createdAt).toLocaleDateString()}
                        {" ("}
                        <TimeAgo datetime={new Date(data.createdAt)} />
                        {")"}
                    </Typography>

                    {Object.keys(data?.attributes || {}).map(key => (
                        <Typography key={key}>
                            {key}: {String((data as any).attributes[key])}
                        </Typography>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
