import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr/immutable";

import useAccountMutation from "@hooks/mutations/useAccountMutation";

import { AxiosCountries } from "./types";

interface FormProps {
    country: AxiosCountries;
}

export default function Country() {
    const { control, handleSubmit } = useForm<FormProps>();

    const { data: countries = [] } = useSWR<AxiosCountries[]>(
        "https://restcountries.com/v3.1/all"
    );

    const {
        data: account,
        actions: {
            settings: { update },
        },
    } = useAccountMutation();

    const onSubmit = ({ country }: FormProps) => {
        update({
            country: country.cca2,
            currency: Object.keys(country.currencies || { USD: "" })[0],
        });
    };

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack width="100%" maxWidth={350} spacing={2}>
                <Typography>
                    Current country:{" "}
                    {account?.settings.country
                        ? `${account.settings.country} (${account.settings.currency})`
                        : "AUTO"}
                </Typography>
                <Controller
                    render={({ field: { onChange }, fieldState: { error }, ...props }) => (
                        <Autocomplete
                            options={countries}
                            getOptionLabel={({ name, flag }) => `${name.common} ${flag}`}
                            onChange={(_, data) => onChange(data)}
                            renderInput={props => (
                                <TextField
                                    {...props}
                                    error={!!error}
                                    helperText={error?.message}
                                    label="Country"
                                />
                            )}
                            {...props}
                        />
                    )}
                    name="country"
                    control={control}
                    rules={{ required: "Select a country" }}
                />

                <Typography>
                    Most of the time this is not needed as the app automatically selects your
                    country/currency
                </Typography>

                <Box alignSelf="flex-end">
                    <Button disabled={!account} variant="contained" type="submit">
                        Save
                    </Button>
                </Box>
            </Stack>
        </Stack>
    );
}
