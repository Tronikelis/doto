import {
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { NextSeo } from "next-seo";
import { useForm } from "react-hook-form";

import { removeNewlines, removeSpaces } from "@config";

import snack from "@hooks/useSnack";

interface FormProps {
    title: string;
    description?: string;
    variant: "home" | "explore";
}

export default function CreateThread() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<FormProps>({
        defaultValues: {
            variant: "explore",
        },
    });

    const onSubmit = async (data: FormProps) => {
        await axios.post("/thread/create", data);
        snack.success(`Created thread`);
    };

    const setValueAs = (comment: string) =>
        comment.trim().replace(removeNewlines, "\n").replace(removeSpaces, "");

    return (
        <Container maxWidth="md" sx={{ mt: 3 }}>
            <NextSeo title="Create a thread" />

            <Typography variant="h5" gutterBottom align="center">
                Create a thread
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
                    <TextField
                        select
                        label="Variant"
                        defaultValue=""
                        inputProps={register("variant", { required: "Choose a variant" })}
                    >
                        <MenuItem value="explore">Explore</MenuItem>
                        <MenuItem value="home">Home</MenuItem>
                    </TextField>

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
