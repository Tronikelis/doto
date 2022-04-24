import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr/immutable";

import useAccountMutation from "@hooks/mutations/useAccountMutation";

import { AxiosCountries } from "./types";

interface Settings {
    country: AxiosCountries;
}

export default function Settings() {
    const { control, handleSubmit } = useForm<Settings>();

    const { data: countries = [] } = useSWR<AxiosCountries[]>(
        "https://restcountries.com/v3.1/all"
    );

    const {
        data: account,
        actions: { updateSettings, resetSettings },
    } = useAccountMutation();

    const onSubmit = ({ country }: Settings) => {
        updateSettings({
            country: country.cca2,
            currency: Object.keys(country.currencies || { USD: "" })[0],
        });
    };

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack width={400} spacing={2}>
                <Typography>
                    Current country:{" "}
                    {account?.settings.country
                        ? `${account.settings.country} (${account.settings.currency})`
                        : "🤔"}
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
                    <Button sx={{ mr: 1 }} onClick={resetSettings}>
                        Reset
                    </Button>
                    <Button variant="contained" type="submit">
                        Save
                    </Button>
                </Box>
            </Stack>
        </Stack>
    );
}
