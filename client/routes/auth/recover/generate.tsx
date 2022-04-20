import KeyIcon from "@mui/icons-material/Key";
import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { NextSeo } from "next-seo";
import Router from "next/router";
import { useForm } from "react-hook-form";

import snack from "@hooks/useSnack";

interface GenerateArgs {
    email: string;
}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export default function Generate() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<GenerateArgs>();

    const onSubmit = async (data: GenerateArgs) => {
        axios.post("/auth/recover/generate", data);

        snack.success("Email has been sent");
        Router.push("/");
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <NextSeo title="Recover password" description="Recover password with an email" />

            <Paper component="form" sx={{ px: 4, py: 2 }} onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h5" align="center" gutterBottom>
                    Recover password
                </Typography>

                <TextField
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    label="Email"
                    type="email"
                    fullWidth
                    {...register("email", {
                        required: "Bro, where is your email?",
                        pattern: {
                            value: emailRegex,
                            message: "That is not an email",
                        },
                        maxLength: {
                            value: 100,
                            message: "That is too long",
                        },
                    })}
                />

                <Stack alignItems="flex-end" mt={2}>
                    <Box>
                        <Button type="submit" disabled={isSubmitting} endIcon={<KeyIcon />}>
                            Recover
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
}
