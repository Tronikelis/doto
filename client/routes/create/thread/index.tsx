import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { removeNewlines, removeSpaces } from "@config";

import snack from "@hooks/useSnack";

interface FormProps {
    title: string;
    description?: string;
}

export default function CreateThread() {
    const {
        query: { slug },
    } = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<FormProps>();

    const onSubmit = async (data: FormProps) => {
        await axios.post("/thread/create", { ...data, slug });
        snack.success(`Created thread on ${slug}`);
    };

    const setValueAs = (comment: string) =>
        comment.trim().replace(removeNewlines, "\n").replace(removeSpaces, "");

    return (
        <Container maxWidth="md" sx={{ mt: 3 }}>
            <Typography my={2} variant="h5">
                Create thread on {`"${slug}"`}
            </Typography>
            <Box component={Paper} p={2}>
                <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
                    <TextField
                        label="Title"
                        variant="standard"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        {...register("title", {
                            required: "Title is required",
                            minLength: 3,
                            maxLength: 200,
                        })}
                    />
                    <TextField
                        label="Description"
                        multiline
                        minRows={4}
                        maxRows={20}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        {...register("description", {
                            maxLength: 10_000,
                            setValueAs,
                        })}
                    />

                    <Box alignSelf="flex-end">
                        <Button
                            disabled={isSubmitting || isSubmitted}
                            variant="contained"
                            type="submit"
                        >
                            Create
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Container>
    );
}