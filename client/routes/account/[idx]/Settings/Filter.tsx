import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import useAccountMutation from "@hooks/mutations/useAccountMutation";

interface FormProps {
    filter: "all" | "pc";
}

export default function Filter() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormProps>();

    const {
        data: account,
        actions: { updateSettings },
    } = useAccountMutation();

    const onSubmit = ({ filter }: FormProps) => {
        updateSettings({ filter });
    };

    return (
        <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
            <Typography>
                Current filter: {account?.settings.filter?.toUpperCase() || "PC"}
            </Typography>
            <TextField
                sx={{ width: 400 }}
                error={!!errors.filter}
                helperText={errors.filter?.message}
                select
                label="Filter"
                defaultValue=""
                inputProps={register("filter", { required: "Choose a filter" })}
            >
                <MenuItem value="all">
                    Show ALL relevant games (console keys included)
                </MenuItem>
                <MenuItem value="pc">Show only PC games (console keys excluded)</MenuItem>
            </TextField>

            <Typography>The default option is to include only PC games</Typography>

            <Box alignSelf="flex-end">
                <Button disabled={!account} variant="contained" type="submit">
                    Save
                </Button>
            </Box>
        </Stack>
    );
}
