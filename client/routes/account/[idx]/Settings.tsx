import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
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
        actions: { updateSettings },
    } = useAccountMutation();

    const onSubmit = ({ country }: Settings) => {
        updateSettings({
            country: country.cca2,
            currency: Object.keys(country.currencies || { USD: "" })[0],
        });
    };

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack width={400} spacing={1.5}>
                <Typography>
                    Most of the time this is not needed as the app auto selects your
                    country/currency
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

                <Typography>Current country: {account?.settings.country || "🤔"}</Typography>

                <Button type="submit">Save</Button>
            </Stack>
        </Stack>
    );
}
